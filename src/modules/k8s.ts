import { Addr } from "netaddr";

import { GridClientConfig } from "../config";
import { expose } from "../helpers/expose";
import { validateInput } from "../helpers/validator";
import { KubernetesHL } from "../high_level/kubernetes";
import { TwinDeployment } from "../high_level/models";
import { Network } from "../primitives/network";
import { Workload, WorkloadTypes } from "../zos/workload";
import { BaseModule } from "./base";
import { AddWorkerModel, DeleteWorkerModel, K8SDeleteModel, K8SGetModel, K8SModel } from "./models";
import { checkBalance } from "./utils";

class K8sModule extends BaseModule {
    moduleName = "kubernetes";
    workloadTypes = [WorkloadTypes.zmachine, WorkloadTypes.zmount, WorkloadTypes.qsfs, WorkloadTypes.ipv4];
    kubernetes: KubernetesHL;

    constructor(public config: GridClientConfig) {
        super(config);
        this.kubernetes = new KubernetesHL(config);
    }

    _getMastersWorkload(deployments): Workload[] {
        const workloads = [];
        for (const deployment of deployments) {
            let d = deployment;
            if (deployment instanceof TwinDeployment) {
                d = deployment.deployment;
            }
            for (const workload of d.workloads) {
                if (workload.type === WorkloadTypes.zmachine && workload.data["env"]["K3S_URL"] === "") {
                    workload["contractId"] = deployment.contract_id;
                    workloads.push(workload);
                }
            }
        }
        return workloads;
    }

    _getWorkersWorkload(deployments): Workload[] {
        const workloads = [];
        for (const deployment of deployments) {
            let d = deployment;
            if (deployment instanceof TwinDeployment) {
                d = deployment.deployment;
            }
            for (const workload of d.workloads) {
                if (workload.type === WorkloadTypes.zmachine && workload.data["env"]["K3S_URL"] !== "") {
                    workload["contractId"] = deployment.contract_id;
                    workloads.push(workload);
                }
            }
        }
        return workloads;
    }

    _getMastersIp(deployments): string[] {
        const ips = [];
        const workloads = this._getMastersWorkload(deployments);
        for (const workload of workloads) {
            ips.push(workload.data["network"]["interfaces"][0]["ip"]);
        }
        return ips;
    }

    async _createDeployment(options: K8SModel, masterIps: string[] = []): Promise<[TwinDeployment[], Network, string]> {
        const network = new Network(options.network.name, options.network.ip_range, this.config);
        await network.load();

        let deployments = [];
        let wireguardConfig = "";
        for (const master of options.masters) {
            const [twinDeployments, wgConfig] = await this.kubernetes.add_master(
                master.name,
                master.node_id,
                options.secret,
                master.cpu,
                master.memory,
                master.rootfs_size,
                master.disk_size,
                master.public_ip,
                master.planetary,
                network,
                options.ssh_key,
                options.metadata,
                options.description,
                master.qsfs_disks,
                this.config.projectName,
                options.network.addAccess,
            );

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
            const [twinDeployments] = await this.kubernetes.add_worker(
                worker.name,
                worker.node_id,
                options.secret,
                masterIps[0],
                worker.cpu,
                worker.memory,
                worker.rootfs_size,
                worker.disk_size,
                worker.public_ip,
                worker.planetary,
                network,
                options.ssh_key,
                options.metadata,
                options.description,
                worker.qsfs_disks,
                this.config.projectName,
                options.network.addAccess,
            );

            deployments = deployments.concat(twinDeployments);
        }
        return [deployments, network, wireguardConfig];
    }

    @expose
    @validateInput
    @checkBalance
    async deploy(options: K8SModel) {
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

    @expose
    @validateInput
    async list() {
        return await this._list();
    }

    async getObj(deploymentName: string) {
        const k = { masters: [], workers: [] };
        const deployments = await this._get(deploymentName);
        const masters = this._getMastersWorkload(deployments);
        const workers = this._getWorkersWorkload(deployments);
        masters.forEach(workload => {
            k.masters.push(this._getZmachineData(deployments, workload));
        });
        workers.forEach(workload => {
            k.workers.push(this._getZmachineData(deployments, workload));
        });
        return k;
    }

    @expose
    @validateInput
    async get(options: K8SGetModel) {
        return await this._get(options.name);
    }

    @expose
    @validateInput
    @checkBalance
    async delete(options: K8SDeleteModel) {
        return await this._delete(options.name);
    }

    @expose
    @validateInput
    @checkBalance
    async update(options: K8SModel) {
        if (!(await this.exists(options.name))) {
            throw Error(`There is no k8s deployment with the name: ${options.name}`);
        }
        if (options.masters.length > 1) {
            throw Error("Multiple masters are not supported");
        }
        const oldDeployments = await this._get(options.name);
        for (const oldDeployment of oldDeployments) {
            for (const workload of oldDeployment.workloads) {
                if (workload.type !== WorkloadTypes.network) {
                    continue;
                }
                const networkName = workload.data["network"].interfaces[0].network;
                const networkIpRange = Addr(workload.data["network"].interfaces[0].ip).mask(16).toString();
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
        const [twinDeployments, network] = await this._createDeployment(options, masterIps);
        return await this._update(this.kubernetes, options.name, oldDeployments, twinDeployments, network);
    }

    @expose
    @validateInput
    @checkBalance
    async add_worker(options: AddWorkerModel) {
        if (!(await this.exists(options.deployment_name))) {
            throw Error(`There is no k8s deployment with the name: ${options.deployment_name}`);
        }
        const oldDeployments = await this._get(options.deployment_name);
        const masterWorkloads = this._getMastersWorkload(oldDeployments);
        if (masterWorkloads.length === 0) {
            throw Error("Couldn't get master node");
        }
        const masterWorkload = masterWorkloads[0];
        const networkName = masterWorkload.data["network"].interfaces[0].network;
        const networkIpRange = Addr(masterWorkload.data["network"].interfaces[0].ip).mask(16).toString();
        const network = new Network(networkName, networkIpRange, this.config);
        await network.load();
        const [twinDeployments] = await this.kubernetes.add_worker(
            options.name,
            options.node_id,
            masterWorkload.data["env"]["K3S_TOKEN"],
            masterWorkload.data["network"]["interfaces"][0]["ip"],
            options.cpu,
            options.memory,
            options.rootfs_size,
            options.disk_size,
            options.public_ip,
            options.planetary,
            network,
            masterWorkload.data["env"]["SSH_KEY"],
            masterWorkload.metadata,
            masterWorkload.description,
            options.qsfs_disks,
            this.config.projectName,
        );

        return await this._add(options.deployment_name, options.node_id, oldDeployments, twinDeployments, network);
    }

    @expose
    @validateInput
    @checkBalance
    async delete_worker(options: DeleteWorkerModel) {
        if (!(await this.exists(options.deployment_name))) {
            throw Error(`There is no k8s deployment with the name: ${options.deployment_name}`);
        }
        return await this._deleteInstance(this.kubernetes, options.deployment_name, options.name);
    }
}

export { K8sModule as k8s };
