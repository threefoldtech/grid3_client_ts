var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { WorkloadTypes } from "../zos/workload";
import { Addr } from "netaddr";
import { BaseModule } from "./base";
import { TwinDeployment } from "../high_level/models";
import { KubernetesHL } from "../high_level/kubernetes";
import { Network } from "../primitives/network";
class K8sModule extends BaseModule {
    constructor(twin_id, url, mnemonic, rmbClient, storePath) {
        super(twin_id, url, mnemonic, rmbClient, storePath);
        this.twin_id = twin_id;
        this.url = url;
        this.mnemonic = mnemonic;
        this.rmbClient = rmbClient;
        this.storePath = storePath;
        this.fileName = "kubernetes.json";
        this.workloadTypes = [WorkloadTypes.zmachine, WorkloadTypes.zmount, WorkloadTypes.qsfs, WorkloadTypes.ipv4];
        this.kubernetes = new KubernetesHL(twin_id, url, mnemonic, rmbClient, this.storePath);
    }
    _getMastersWorkload(deployments) {
        const workloads = [];
        for (const deployment of deployments) {
            let d = deployment;
            if (deployment instanceof TwinDeployment) {
                d = deployment.deployment;
            }
            for (const workload of d.workloads) {
                if (workload.type === WorkloadTypes.zmachine && workload.data["env"]["K3S_URL"] === "") {
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
    _createDeployment(options, masterIps = []) {
        return __awaiter(this, void 0, void 0, function* () {
            const network = new Network(options.network.name, options.network.ip_range, this.rmbClient, this.storePath, this.url);
            yield network.load(true);
            let deployments = [];
            let wireguardConfig = "";
            for (const master of options.masters) {
                const [twinDeployments, wgConfig] = yield this.kubernetes.add_master(master.name, master.node_id, options.secret, master.cpu, master.memory, master.rootfs_size, master.disk_size, master.public_ip, master.planetary, network, options.ssh_key, options.metadata, options.description, master.qsfs_disks, this.projectName);
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
                const [twinDeployments, _] = yield this.kubernetes.add_worker(worker.name, worker.node_id, options.secret, masterIps[0], worker.cpu, worker.memory, worker.rootfs_size, worker.disk_size, worker.public_ip, worker.planetary, network, options.ssh_key, options.metadata, options.description);
                deployments = deployments.concat(twinDeployments);
            }
            return [deployments, network, wireguardConfig];
        });
    }
    deploy(options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (options.masters.length > 1) {
                throw Error("Multi master is not supported");
            }
            if (this.exists(options.name)) {
                throw Error(`Another k8s deployment with the same name ${options.name} is already exist`);
            }
            const [deployments, _, wireguardConfig] = yield this._createDeployment(options);
            const contracts = yield this.twinDeploymentHandler.handle(deployments);
            this.save(options.name, contracts, wireguardConfig);
            return { contracts: contracts, wireguard_config: wireguardConfig };
        });
    }
    list() {
        return this._list();
    }
    get(options) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._get(options.name);
        });
    }
    delete(options) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._delete(options.name);
        });
    }
    update(options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.exists(options.name)) {
                throw Error(`There is no k8s deployment with name: ${options.name}`);
            }
            if (options.masters.length > 1) {
                throw Error("Multi master is not supported");
            }
            const oldDeployments = yield this._get(options.name);
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
            const [twinDeployments, network, _] = yield this._createDeployment(options, masterIps);
            return yield this._update(this.kubernetes, options.name, oldDeployments, twinDeployments, network);
        });
    }
    addWorker(options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.exists(options.deployment_name)) {
                throw Error(`There is no k8s deployment with name: ${options.deployment_name}`);
            }
            const oldDeployments = yield this._get(options.deployment_name);
            const masterWorkloads = this._getMastersWorkload(oldDeployments);
            if (masterWorkloads.length === 0) {
                throw Error("Couldn't get master node");
            }
            const masterWorkload = masterWorkloads[0];
            const networkName = masterWorkload.data["network"].interfaces[0].network;
            const networkIpRange = Addr(masterWorkload.data["network"].interfaces[0].ip).mask(16).toString();
            const network = new Network(networkName, networkIpRange, this.rmbClient, this.storePath, this.url);
            yield network.load(true);
            const [twinDeployments, _] = yield this.kubernetes.add_worker(options.name, options.node_id, masterWorkload.data["env"]["K3S_TOKEN"], masterWorkload.data["network"]["interfaces"][0]["ip"], options.cpu, options.memory, options.rootfs_size, options.disk_size, options.public_ip, options.planetary, network, masterWorkload.data["env"]["SSH_KEY"], masterWorkload.metadata, masterWorkload.description, options.qsfs_disks, this.projectName);
            return yield this._add(options.deployment_name, options.node_id, oldDeployments, twinDeployments, network);
        });
    }
    deleteWorker(options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.exists(options.deployment_name)) {
                throw Error(`There is no k8s deployment with name: ${options.deployment_name}`);
            }
            return yield this._deleteInstance(this.kubernetes, options.deployment_name, options.name);
        });
    }
}
export { K8sModule };
