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
import { WorkloadTypes } from "../zos/workload";
import { BaseModule } from "./base";
import { Network } from "../primitives/network";
import { VMHL } from "../high_level/machine";
class MachineModule extends BaseModule {
    constructor(twin_id, url, mnemonic, rmbClient, storePath, projectName = "") {
        super(twin_id, url, mnemonic, rmbClient, storePath, projectName);
        this.twin_id = twin_id;
        this.url = url;
        this.mnemonic = mnemonic;
        this.rmbClient = rmbClient;
        this.storePath = storePath;
        this.fileName = "machines.json";
        this.workloadTypes = [WorkloadTypes.zmachine, WorkloadTypes.zmount, WorkloadTypes.qsfs, WorkloadTypes.ipv4];
        this.vm = new VMHL(twin_id, url, mnemonic, rmbClient, this.storePath);
    }
    _createDeloyment(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const networkName = options.network.name;
            const network = new Network(networkName, options.network.ip_range, this.rmbClient, this.storePath, this.url);
            yield network.load(true);
            let twinDeployments = [];
            let wireguardConfig = "";
            for (const machine of options.machines) {
                const [TDeployments, wgConfig] = yield this.vm.create(machine.name, machine.node_id, machine.flist, machine.cpu, machine.memory, machine.rootfs_size, machine.disks, machine.public_ip, machine.planetary, network, machine.entrypoint, machine.env, options.metadata, options.description, machine.qsfs_disks, this.projectName);
                twinDeployments = twinDeployments.concat(TDeployments);
                if (wgConfig) {
                    wireguardConfig = wgConfig;
                }
            }
            return [twinDeployments, network, wireguardConfig];
        });
    }
    _getMachineWorkload(deployments) {
        for (const deployment of deployments) {
            for (const workload of deployment.workloads) {
                if (workload.type === WorkloadTypes.zmachine) {
                    return workload;
                }
            }
        }
    }
    deploy(options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.exists(options.name)) {
                throw Error(`Another machine deployment with the same name ${options.name} is already exist`);
            }
            const [twinDeployments, _, wireguardConfig] = yield this._createDeloyment(options);
            const contracts = yield this.twinDeploymentHandler.handle(twinDeployments);
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
                throw Error(`There is no machine with name: ${options.name}`);
            }
            const oldDeployments = yield this._get(options.name);
            const workload = this._getMachineWorkload(oldDeployments);
            const networkName = workload.data["network"].interfaces[0].network;
            const networkIpRange = Addr(workload.data["network"].interfaces[0].ip).mask(16).toString();
            if (networkName !== options.network.name || networkIpRange !== options.network.ip_range) {
                throw Error("Network name and ip_range can't be changed");
            }
            const [twinDeployments, network, _] = yield this._createDeloyment(options);
            return yield this._update(this.vm, options.name, oldDeployments, twinDeployments, network);
        });
    }
    addMachine(options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.exists(options.deployment_name)) {
                throw Error(`There is no machines deployment with name: ${options.deployment_name}`);
            }
            const oldDeployments = yield this._get(options.deployment_name);
            const workload = this._getMachineWorkload(oldDeployments);
            const networkName = workload.data["network"].interfaces[0].network;
            const networkIpRange = Addr(workload.data["network"].interfaces[0].ip).mask(16).toString();
            const network = new Network(networkName, networkIpRange, this.rmbClient, this.storePath, this.url);
            yield network.load(true);
            const [twinDeployments, wgConfig] = yield this.vm.create(options.name, options.node_id, options.flist, options.cpu, options.memory, options.rootfs_size, options.disks, options.public_ip, options.planetary, network, options.entrypoint, options.env, workload.metadata, workload.description, options.qsfs_disks, this.projectName);
            return yield this._add(options.deployment_name, options.node_id, oldDeployments, twinDeployments, network);
        });
    }
    deleteMachine(options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.exists(options.deployment_name)) {
                throw Error(`There is no machines deployment with name: ${options.deployment_name}`);
            }
            return yield this._deleteInstance(this.vm, options.deployment_name, options.name);
        });
    }
}
export { MachineModule };
