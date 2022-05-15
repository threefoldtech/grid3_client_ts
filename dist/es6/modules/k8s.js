var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Addr } from "netaddr";
import { expose } from "../helpers/expose";
import { validateInput } from "../helpers/validator";
import { KubernetesHL } from "../high_level/kubernetes";
import { TwinDeployment } from "../high_level/models";
import { Network } from "../primitives/network";
import { WorkloadTypes } from "../zos/workload";
import { BaseModule } from "./base";
import { AddWorkerModel, DeleteWorkerModel, K8SDeleteModel, K8SGetModel, K8SModel } from "./models";
import { checkBalance } from "./utils";
class K8sModule extends BaseModule {
    constructor(config) {
        super(config);
        this.config = config;
        this.moduleName = "kubernetes";
        this.workloadTypes = [
            WorkloadTypes.zmachine,
            WorkloadTypes.zmount,
            WorkloadTypes.qsfs,
            WorkloadTypes.ip,
            WorkloadTypes.ipv4,
        ]; // TODO: remove deprecated
        this.kubernetes = new KubernetesHL(config);
    }
    _getMastersWorkload(deploymentName, deployments) {
        return __awaiter(this, void 0, void 0, function* () {
            const workloads = [];
            for (const deployment of deployments) {
                let d = deployment;
                if (deployment instanceof TwinDeployment) {
                    d = deployment.deployment;
                }
                for (const workload of d.workloads) {
                    if (workload.type === WorkloadTypes.zmachine && workload.data["env"]["K3S_URL"] === "") {
                        workload["contractId"] = deployment.contract_id;
                        workload["nodeId"] = yield this._getNodeIdFromContractId(deploymentName, deployment.contract_id);
                        workloads.push(workload);
                    }
                }
            }
            return workloads;
        });
    }
    _getWorkersWorkload(deploymentName, deployments) {
        return __awaiter(this, void 0, void 0, function* () {
            const workloads = [];
            for (const deployment of deployments) {
                let d = deployment;
                if (deployment instanceof TwinDeployment) {
                    d = deployment.deployment;
                }
                for (const workload of d.workloads) {
                    if (workload.type === WorkloadTypes.zmachine && workload.data["env"]["K3S_URL"] !== "") {
                        workload["contractId"] = deployment.contract_id;
                        workload["nodeId"] = yield this._getNodeIdFromContractId(deploymentName, deployment.contract_id);
                        workloads.push(workload);
                    }
                }
            }
            return workloads;
        });
    }
    _getMastersIp(deploymentName, deployments) {
        return __awaiter(this, void 0, void 0, function* () {
            const ips = [];
            const workloads = yield this._getMastersWorkload(deploymentName, deployments);
            for (const workload of workloads) {
                ips.push(workload.data["network"]["interfaces"][0]["ip"]);
            }
            return ips;
        });
    }
    _createDeployment(options, masterIps = []) {
        return __awaiter(this, void 0, void 0, function* () {
            const network = new Network(options.network.name, options.network.ip_range, this.config);
            yield network.load();
            let deployments = [];
            let wireguardConfig = "";
            for (const master of options.masters) {
                const [twinDeployments, wgConfig] = yield this.kubernetes.add_master(master.name, master.node_id, options.secret, master.cpu, master.memory, master.rootfs_size, master.disk_size, master.public_ip, master.public_ip6, master.planetary, network, options.ssh_key, options.metadata, options.description, master.qsfs_disks, this.config.projectName, options.network.addAccess, master.ip, master.corex);
                deployments = deployments.concat(twinDeployments);
                if (wgConfig) {
                    wireguardConfig = wgConfig;
                }
            }
            if (masterIps.length === 0) {
                masterIps = yield this._getMastersIp(options.name, deployments);
                if (masterIps.length === 0) {
                    throw Error("Couldn't get master ip");
                }
            }
            for (const worker of options.workers) {
                const [twinDeployments] = yield this.kubernetes.add_worker(worker.name, worker.node_id, options.secret, masterIps[masterIps.length - 1], worker.cpu, worker.memory, worker.rootfs_size, worker.disk_size, worker.public_ip, worker.public_ip6, worker.planetary, network, options.ssh_key, options.metadata, options.description, worker.qsfs_disks, this.config.projectName, options.network.addAccess, worker.ip, worker.corex);
                deployments = deployments.concat(twinDeployments);
            }
            return [deployments, network, wireguardConfig];
        });
    }
    deploy(options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (options.masters.length > 1) {
                throw Error("Multiple masters are not supported");
            }
            if (yield this.exists(options.name)) {
                throw Error(`Another k8s deployment with the same name ${options.name} already exists`);
            }
            const [deployments, , wireguardConfig] = yield this._createDeployment(options);
            const contracts = yield this.twinDeploymentHandler.handle(deployments);
            yield this.save(options.name, contracts, wireguardConfig);
            return { contracts: contracts, wireguard_config: wireguardConfig };
        });
    }
    list() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._list();
        });
    }
    getObj(deploymentName) {
        return __awaiter(this, void 0, void 0, function* () {
            const k = { masters: [], workers: [] };
            const deployments = yield this._get(deploymentName);
            const masters = yield this._getMastersWorkload(deploymentName, deployments);
            const workers = yield this._getWorkersWorkload(deploymentName, deployments);
            for (const master of masters) {
                k.masters.push(yield this._getZmachineData(deploymentName, deployments, master));
            }
            for (const worker of workers) {
                k.workers.push(yield this._getZmachineData(deploymentName, deployments, worker));
            }
            return k;
        });
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
            if (!(yield this.exists(options.name))) {
                throw Error(`There is no k8s deployment with the name: ${options.name}`);
            }
            if (options.masters.length > 1) {
                throw Error("Multiple masters are not supported");
            }
            const oldDeployments = yield this._get(options.name);
            const masterIps = yield this._getMastersIp(options.name, oldDeployments);
            if (masterIps.length === 0) {
                throw Error("Couldn't get master ip");
            }
            const masterWorkloads = yield this._getMastersWorkload(options.name, oldDeployments);
            if (masterWorkloads.length === 0) {
                throw Error("Couldn't get master node");
            }
            const masterWorkload = masterWorkloads[0];
            const networkName = masterWorkload.data["network"].interfaces[0].network;
            const networkIpRange = Addr(masterWorkload.data["network"].interfaces[0].ip).mask(16).toString();
            if (networkName !== options.network.name && networkIpRange !== options.network.ip_range) {
                throw Error("Network name and ip_range can't be changed");
            }
            //TODO: check that the master nodes are not changed
            const [twinDeployments, network] = yield this._createDeployment(options, masterIps);
            return yield this._update(this.kubernetes, options.name, oldDeployments, twinDeployments, network);
        });
    }
    add_worker(options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(yield this.exists(options.deployment_name))) {
                throw Error(`There is no k8s deployment with the name: ${options.deployment_name}`);
            }
            const oldDeployments = yield this._get(options.deployment_name);
            const masterWorkloads = yield this._getMastersWorkload(options.deployment_name, oldDeployments);
            if (masterWorkloads.length === 0) {
                throw Error("Couldn't get master node");
            }
            const masterWorkload = masterWorkloads[masterWorkloads.length - 1];
            const networkName = masterWorkload.data["network"].interfaces[0].network;
            const networkIpRange = Addr(masterWorkload.data["network"].interfaces[0].ip).mask(16).toString();
            const network = new Network(networkName, networkIpRange, this.config);
            yield network.load();
            const [twinDeployments] = yield this.kubernetes.add_worker(options.name, options.node_id, masterWorkload.data["env"]["K3S_TOKEN"], masterWorkload.data["network"]["interfaces"][0]["ip"], options.cpu, options.memory, options.rootfs_size, options.disk_size, options.public_ip, options.public_ip6, options.planetary, network, masterWorkload.data["env"]["SSH_KEY"], masterWorkload.metadata, masterWorkload.description, options.qsfs_disks, this.config.projectName, false, options.ip, options.corex);
            return yield this._add(options.deployment_name, options.node_id, oldDeployments, twinDeployments, network);
        });
    }
    delete_worker(options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(yield this.exists(options.deployment_name))) {
                throw Error(`There is no k8s deployment with the name: ${options.deployment_name}`);
            }
            return yield this._deleteInstance(this.kubernetes, options.deployment_name, options.name);
        });
    }
}
__decorate([
    expose,
    validateInput,
    checkBalance,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [K8SModel]),
    __metadata("design:returntype", Promise)
], K8sModule.prototype, "deploy", null);
__decorate([
    expose,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], K8sModule.prototype, "list", null);
__decorate([
    expose,
    validateInput,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [K8SGetModel]),
    __metadata("design:returntype", Promise)
], K8sModule.prototype, "get", null);
__decorate([
    expose,
    validateInput,
    checkBalance,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [K8SDeleteModel]),
    __metadata("design:returntype", Promise)
], K8sModule.prototype, "delete", null);
__decorate([
    expose,
    validateInput,
    checkBalance,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [K8SModel]),
    __metadata("design:returntype", Promise)
], K8sModule.prototype, "update", null);
__decorate([
    expose,
    validateInput,
    checkBalance,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [AddWorkerModel]),
    __metadata("design:returntype", Promise)
], K8sModule.prototype, "add_worker", null);
__decorate([
    expose,
    validateInput,
    checkBalance,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [DeleteWorkerModel]),
    __metadata("design:returntype", Promise)
], K8sModule.prototype, "delete_worker", null);
export { K8sModule as k8s };
