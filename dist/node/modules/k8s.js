"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.k8s = void 0;
const netaddr_1 = require("netaddr");
const expose_1 = require("../helpers/expose");
const validator_1 = require("../helpers/validator");
const kubernetes_1 = require("../high_level/kubernetes");
const models_1 = require("../high_level/models");
const network_1 = require("../primitives/network");
const workload_1 = require("../zos/workload");
const base_1 = require("./base");
const models_2 = require("./models");
const utils_1 = require("./utils");
class K8sModule extends base_1.BaseModule {
    config;
    moduleName = "kubernetes";
    workloadTypes = [
        workload_1.WorkloadTypes.zmachine,
        workload_1.WorkloadTypes.zmount,
        workload_1.WorkloadTypes.qsfs,
        workload_1.WorkloadTypes.ip,
        workload_1.WorkloadTypes.ipv4,
    ]; // TODO: remove deprecated
    kubernetes;
    constructor(config) {
        super(config);
        this.config = config;
        this.kubernetes = new kubernetes_1.KubernetesHL(config);
    }
    async _getMastersWorkload(deploymentName, deployments) {
        const workloads = [];
        for (const deployment of deployments) {
            let d = deployment;
            if (deployment instanceof models_1.TwinDeployment) {
                d = deployment.deployment;
            }
            for (const workload of d.workloads) {
                if (workload.type === workload_1.WorkloadTypes.zmachine && workload.data["env"]["K3S_URL"] === "") {
                    workload["contractId"] = deployment.contract_id;
                    workload["nodeId"] = await this._getNodeIdFromContractId(deploymentName, deployment.contract_id);
                    workloads.push(workload);
                }
            }
        }
        return workloads;
    }
    async _getWorkersWorkload(deploymentName, deployments) {
        const workloads = [];
        for (const deployment of deployments) {
            let d = deployment;
            if (deployment instanceof models_1.TwinDeployment) {
                d = deployment.deployment;
            }
            for (const workload of d.workloads) {
                if (workload.type === workload_1.WorkloadTypes.zmachine && workload.data["env"]["K3S_URL"] !== "") {
                    workload["contractId"] = deployment.contract_id;
                    workload["nodeId"] = await this._getNodeIdFromContractId(deploymentName, deployment.contract_id);
                    workloads.push(workload);
                }
            }
        }
        return workloads;
    }
    async _getMastersIp(deploymentName, deployments) {
        const ips = [];
        const workloads = await this._getMastersWorkload(deploymentName, deployments);
        for (const workload of workloads) {
            ips.push(workload.data["network"]["interfaces"][0]["ip"]);
        }
        return ips;
    }
    async _createDeployment(options, masterIps = []) {
        const network = new network_1.Network(options.network.name, options.network.ip_range, this.config);
        await network.load();
        let deployments = [];
        let wireguardConfig = "";
        for (const master of options.masters) {
            const [twinDeployments, wgConfig] = await this.kubernetes.add_master(master.name, master.node_id, options.secret, master.cpu, master.memory, master.rootfs_size, master.disk_size, master.public_ip, master.public_ip6, master.planetary, network, options.ssh_key, options.metadata, options.description, master.qsfs_disks, this.config.projectName, options.network.addAccess, master.ip, master.corex);
            deployments = deployments.concat(twinDeployments);
            if (wgConfig) {
                wireguardConfig = wgConfig;
            }
        }
        if (masterIps.length === 0) {
            masterIps = await this._getMastersIp(options.name, deployments);
            if (masterIps.length === 0) {
                throw Error("Couldn't get master ip");
            }
        }
        for (const worker of options.workers) {
            const [twinDeployments] = await this.kubernetes.add_worker(worker.name, worker.node_id, options.secret, masterIps[masterIps.length - 1], worker.cpu, worker.memory, worker.rootfs_size, worker.disk_size, worker.public_ip, worker.public_ip6, worker.planetary, network, options.ssh_key, options.metadata, options.description, worker.qsfs_disks, this.config.projectName, options.network.addAccess, worker.ip, worker.corex);
            deployments = deployments.concat(twinDeployments);
        }
        return [deployments, network, wireguardConfig];
    }
    async deploy(options) {
        if (options.masters.length > 1) {
            throw Error("Multiple masters are not supported");
        }
        if (await this.exists(options.name)) {
            throw Error(`Another k8s deployment with the same name ${options.name} already exists`);
        }
        const [deployments, , wireguardConfig] = await this._createDeployment(options);
        const contracts = await this.twinDeploymentHandler.handle(deployments);
        await this.save(options.name, contracts, wireguardConfig);
        return { contracts: contracts, wireguard_config: wireguardConfig };
    }
    async list() {
        return await this._list();
    }
    async getObj(deploymentName) {
        const k = { masters: [], workers: [] };
        const deployments = await this._get(deploymentName);
        const masters = await this._getMastersWorkload(deploymentName, deployments);
        const workers = await this._getWorkersWorkload(deploymentName, deployments);
        for (const master of masters) {
            k.masters.push(await this._getZmachineData(deploymentName, deployments, master));
        }
        for (const worker of workers) {
            k.workers.push(await this._getZmachineData(deploymentName, deployments, worker));
        }
        return k;
    }
    async get(options) {
        return await this._get(options.name);
    }
    async delete(options) {
        return await this._delete(options.name);
    }
    async update(options) {
        if (!(await this.exists(options.name))) {
            throw Error(`There is no k8s deployment with the name: ${options.name}`);
        }
        if (options.masters.length > 1) {
            throw Error("Multiple masters are not supported");
        }
        const oldDeployments = await this._get(options.name);
        const masterIps = await this._getMastersIp(options.name, oldDeployments);
        if (masterIps.length === 0) {
            throw Error("Couldn't get master ip");
        }
        const masterWorkloads = await this._getMastersWorkload(options.name, oldDeployments);
        if (masterWorkloads.length === 0) {
            throw Error("Couldn't get master node");
        }
        const masterWorkload = masterWorkloads[0];
        const networkName = masterWorkload.data["network"].interfaces[0].network;
        const networkIpRange = (0, netaddr_1.Addr)(masterWorkload.data["network"].interfaces[0].ip).mask(16).toString();
        if (networkName !== options.network.name && networkIpRange !== options.network.ip_range) {
            throw Error("Network name and ip_range can't be changed");
        }
        //TODO: check that the master nodes are not changed
        const [twinDeployments, network] = await this._createDeployment(options, masterIps);
        return await this._update(this.kubernetes, options.name, oldDeployments, twinDeployments, network);
    }
    async add_worker(options) {
        if (!(await this.exists(options.deployment_name))) {
            throw Error(`There is no k8s deployment with the name: ${options.deployment_name}`);
        }
        const oldDeployments = await this._get(options.deployment_name);
        const masterWorkloads = await this._getMastersWorkload(options.deployment_name, oldDeployments);
        if (masterWorkloads.length === 0) {
            throw Error("Couldn't get master node");
        }
        const masterWorkload = masterWorkloads[masterWorkloads.length - 1];
        const networkName = masterWorkload.data["network"].interfaces[0].network;
        const networkIpRange = (0, netaddr_1.Addr)(masterWorkload.data["network"].interfaces[0].ip).mask(16).toString();
        const network = new network_1.Network(networkName, networkIpRange, this.config);
        await network.load();
        const [twinDeployments] = await this.kubernetes.add_worker(options.name, options.node_id, masterWorkload.data["env"]["K3S_TOKEN"], masterWorkload.data["network"]["interfaces"][0]["ip"], options.cpu, options.memory, options.rootfs_size, options.disk_size, options.public_ip, options.public_ip6, options.planetary, network, masterWorkload.data["env"]["SSH_KEY"], masterWorkload.metadata, masterWorkload.description, options.qsfs_disks, this.config.projectName, false, options.ip, options.corex);
        return await this._add(options.deployment_name, options.node_id, oldDeployments, twinDeployments, network);
    }
    async delete_worker(options) {
        if (!(await this.exists(options.deployment_name))) {
            throw Error(`There is no k8s deployment with the name: ${options.deployment_name}`);
        }
        return await this._deleteInstance(this.kubernetes, options.deployment_name, options.name);
    }
}
__decorate([
    expose_1.expose,
    validator_1.validateInput,
    utils_1.checkBalance,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [models_2.K8SModel]),
    __metadata("design:returntype", Promise)
], K8sModule.prototype, "deploy", null);
__decorate([
    expose_1.expose,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], K8sModule.prototype, "list", null);
__decorate([
    expose_1.expose,
    validator_1.validateInput,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [models_2.K8SGetModel]),
    __metadata("design:returntype", Promise)
], K8sModule.prototype, "get", null);
__decorate([
    expose_1.expose,
    validator_1.validateInput,
    utils_1.checkBalance,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [models_2.K8SDeleteModel]),
    __metadata("design:returntype", Promise)
], K8sModule.prototype, "delete", null);
__decorate([
    expose_1.expose,
    validator_1.validateInput,
    utils_1.checkBalance,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [models_2.K8SModel]),
    __metadata("design:returntype", Promise)
], K8sModule.prototype, "update", null);
__decorate([
    expose_1.expose,
    validator_1.validateInput,
    utils_1.checkBalance,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [models_2.AddWorkerModel]),
    __metadata("design:returntype", Promise)
], K8sModule.prototype, "add_worker", null);
__decorate([
    expose_1.expose,
    validator_1.validateInput,
    utils_1.checkBalance,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [models_2.DeleteWorkerModel]),
    __metadata("design:returntype", Promise)
], K8sModule.prototype, "delete_worker", null);
exports.k8s = K8sModule;
