"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.K8sModule = void 0;
const workload_1 = require("../zos/workload");
const netaddr_1 = require("netaddr");
const base_1 = require("./base");
const models_1 = require("../high_level/models");
const kubernetes_1 = require("../high_level/kubernetes");
const network_1 = require("../primitives/network");
class K8sModule extends base_1.BaseModule {
    twin_id;
    url;
    mnemonic;
    rmbClient;
    storePath;
    fileName = "kubernetes.json";
    workloadTypes = [workload_1.WorkloadTypes.zmachine, workload_1.WorkloadTypes.zmount, workload_1.WorkloadTypes.qsfs, workload_1.WorkloadTypes.ipv4];
    kubernetes;
    constructor(twin_id, url, mnemonic, rmbClient, storePath) {
        super(twin_id, url, mnemonic, rmbClient, storePath);
        this.twin_id = twin_id;
        this.url = url;
        this.mnemonic = mnemonic;
        this.rmbClient = rmbClient;
        this.storePath = storePath;
        this.kubernetes = new kubernetes_1.KubernetesHL(twin_id, url, mnemonic, rmbClient, this.storePath);
    }
    _getMastersWorkload(deployments) {
        const workloads = [];
        for (const deployment of deployments) {
            let d = deployment;
            if (deployment instanceof models_1.TwinDeployment) {
                d = deployment.deployment;
            }
            for (const workload of d.workloads) {
                if (workload.type === workload_1.WorkloadTypes.zmachine && workload.data["env"]["K3S_URL"] === "") {
                    workloads.push(workload);
                }
            }
        }
        return workloads;
    }
    _getMastersIp(deployments) {
        const ips = [];
        const workloads = this._getMastersWorkload(deployments);
        for (const workload of workloads) {
            ips.push(workload.data["network"]["interfaces"][0]["ip"]);
        }
        return ips;
    }
    async _createDeployment(options, masterIps = []) {
        const network = new network_1.Network(options.network.name, options.network.ip_range, this.rmbClient, this.storePath);
        await network.load(true);
        let deployments = [];
        let wireguardConfig = "";
        for (const master of options.masters) {
            const [twinDeployments, wgConfig] = await this.kubernetes.add_master(master.name, master.node_id, options.secret, master.cpu, master.memory, master.rootfs_size, master.disk_size, master.public_ip, master.planetary, network, options.ssh_key, options.metadata, options.description, master.qsfs_disks, this.projectName);
            deployments = deployments.concat(twinDeployments);
            if (wgConfig) {
                wireguardConfig = wgConfig;
            }
        }
        if (masterIps.length === 0) {
            masterIps = this._getMastersIp(deployments);
            if (masterIps.length === 0) {
                throw Error("Couldn't get master ip");
            }
        }
        for (const worker of options.workers) {
            const [twinDeployments, _] = await this.kubernetes.add_worker(worker.name, worker.node_id, options.secret, masterIps[0], worker.cpu, worker.memory, worker.rootfs_size, worker.disk_size, worker.public_ip, worker.planetary, network, options.ssh_key, options.metadata, options.description);
            deployments = deployments.concat(twinDeployments);
        }
        return [deployments, network, wireguardConfig];
    }
    async deploy(options) {
        if (options.masters.length > 1) {
            throw Error("Multi master is not supported");
        }
        if (this.exists(options.name)) {
            throw Error(`Another k8s deployment with the same name ${options.name} is already exist`);
        }
        const [deployments, _, wireguardConfig] = await this._createDeployment(options);
        const contracts = await this.twinDeploymentHandler.handle(deployments);
        this.save(options.name, contracts, wireguardConfig);
        return { contracts: contracts, wireguard_config: wireguardConfig };
    }
    list() {
        return this._list();
    }
    async get(options) {
        return await this._get(options.name);
    }
    async delete(options) {
        return await this._delete(options.name);
    }
    async update(options) {
        if (!this.exists(options.name)) {
            throw Error(`There is no k8s deployment with name: ${options.name}`);
        }
        if (options.masters.length > 1) {
            throw Error("Multi master is not supported");
        }
        const oldDeployments = await this._get(options.name);
        for (const oldDeployment of oldDeployments) {
            for (const workload of oldDeployment.workloads) {
                if (workload.type !== workload_1.WorkloadTypes.network) {
                    continue;
                }
                const networkName = workload.data["network"].interfaces[0].network;
                const networkIpRange = (0, netaddr_1.Addr)(workload.data["network"].interfaces[0].ip).mask(16).toString();
                if (networkName === options.network.name && networkIpRange === options.network.ip_range) {
                    break;
                }
                throw Error("Network name and ip_range can't be changed");
            }
        }
        const masterIps = this._getMastersIp(oldDeployments);
        if (masterIps.length === 0) {
            throw Error("Couldn't get master ip");
        }
        //TODO: check that the master nodes are not changed
        const [twinDeployments, network, _] = await this._createDeployment(options, masterIps);
        return await this._update(this.kubernetes, options.name, oldDeployments, twinDeployments, network);
    }
    async addWorker(options) {
        if (!this.exists(options.deployment_name)) {
            throw Error(`There is no k8s deployment with name: ${options.deployment_name}`);
        }
        const oldDeployments = await this._get(options.deployment_name);
        const masterWorkloads = this._getMastersWorkload(oldDeployments);
        if (masterWorkloads.length === 0) {
            throw Error("Couldn't get master node");
        }
        const masterWorkload = masterWorkloads[0];
        const networkName = masterWorkload.data["network"].interfaces[0].network;
        const networkIpRange = (0, netaddr_1.Addr)(masterWorkload.data["network"].interfaces[0].ip).mask(16).toString();
        const network = new network_1.Network(networkName, networkIpRange, this.rmbClient, this.storePath);
        await network.load(true);
        const [twinDeployments, _] = await this.kubernetes.add_worker(options.name, options.node_id, masterWorkload.data["env"]["K3S_TOKEN"], masterWorkload.data["network"]["interfaces"][0]["ip"], options.cpu, options.memory, options.rootfs_size, options.disk_size, options.public_ip, options.planetary, network, masterWorkload.data["env"]["SSH_KEY"], masterWorkload.metadata, masterWorkload.description, options.qsfs_disks, this.projectName);
        return await this._add(options.deployment_name, options.node_id, oldDeployments, twinDeployments, network);
    }
    async deleteWorker(options) {
        if (!this.exists(options.deployment_name)) {
            throw Error(`There is no k8s deployment with name: ${options.deployment_name}`);
        }
        return await this._deleteInstance(this.kubernetes, options.deployment_name, options.name);
    }
}
exports.K8sModule = K8sModule;
