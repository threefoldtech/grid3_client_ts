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
import { VMHL } from "../high_level/machine";
import { Network } from "../primitives/network";
import { WorkloadTypes } from "../zos/workload";
import { BaseModule } from "./base";
import { AddMachineModel, DeleteMachineModel, MachinesDeleteModel, MachinesGetModel, MachinesModel } from "./models";
import { checkBalance } from "./utils";
class MachinesModule extends BaseModule {
    constructor(config) {
        super(config);
        this.config = config;
        this.moduleName = "machines";
        this.workloadTypes = [
            WorkloadTypes.zmachine,
            WorkloadTypes.zmount,
            WorkloadTypes.qsfs,
            WorkloadTypes.ip,
            WorkloadTypes.ipv4,
        ]; // TODO: remove deprecated
        this.vm = new VMHL(config);
    }
    _createDeployment(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const network = new Network(options.network.name, options.network.ip_range, this.config);
            yield network.load();
            let twinDeployments = [];
            let wireguardConfig = "";
            for (const machine of options.machines) {
                const [TDeployments, wgConfig] = yield this.vm.create(machine.name, machine.node_id, machine.flist, machine.cpu, machine.memory, machine.rootfs_size, machine.disks, machine.public_ip, machine.public_ip6, machine.planetary, network, machine.entrypoint, machine.env, options.metadata, options.description, machine.qsfs_disks, this.config.projectName, options.network.addAccess, machine.ip, machine.corex);
                twinDeployments = twinDeployments.concat(TDeployments);
                if (wgConfig) {
                    wireguardConfig = wgConfig;
                }
            }
            return [twinDeployments, network, wireguardConfig];
        });
    }
    deploy(options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (yield this.exists(options.name)) {
                throw Error(`Another machine deployment with the same name ${options.name} already exists`);
            }
            const [twinDeployments, , wireguardConfig] = yield this._createDeployment(options);
            const contracts = yield this.twinDeploymentHandler.handle(twinDeployments);
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
            const deployments = yield this._get(deploymentName);
            const workloads = yield this._getWorkloadsByTypes(deploymentName, deployments, [WorkloadTypes.zmachine]);
            const promises = workloads.map((workload) => __awaiter(this, void 0, void 0, function* () { return yield this._getZmachineData(deploymentName, deployments, workload); }));
            return yield Promise.all(promises);
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
                throw Error(`There is no machine with the name: ${options.name}`);
            }
            const oldDeployments = yield this._get(options.name);
            const workload = (yield this._getWorkloadsByTypes(options.name, oldDeployments, [WorkloadTypes.zmachine]))[0];
            const networkName = workload.data["network"].interfaces[0].network;
            const networkIpRange = Addr(workload.data["network"].interfaces[0].ip).mask(16).toString();
            if (networkName !== options.network.name || networkIpRange !== options.network.ip_range) {
                throw Error("Network name and ip_range can't be changed");
            }
            const [twinDeployments, network] = yield this._createDeployment(options);
            return yield this._update(this.vm, options.name, oldDeployments, twinDeployments, network);
        });
    }
    add_machine(options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(yield this.exists(options.deployment_name))) {
                throw Error(`There are no machine deployments with the name: ${options.deployment_name}`);
            }
            const oldDeployments = yield this._get(options.deployment_name);
            const workload = (yield this._getWorkloadsByTypes(options.deployment_name, oldDeployments, [WorkloadTypes.zmachine]))[0];
            const networkName = workload.data["network"].interfaces[0].network;
            const networkIpRange = Addr(workload.data["network"].interfaces[0].ip).mask(16).toString();
            const network = new Network(networkName, networkIpRange, this.config);
            yield network.load();
            const [twinDeployments] = yield this.vm.create(options.name, options.node_id, options.flist, options.cpu, options.memory, options.rootfs_size, options.disks, options.public_ip, options.public_ip6, options.planetary, network, options.entrypoint, options.env, workload.metadata, workload.description, options.qsfs_disks, this.config.projectName, false, options.ip, options.corex);
            return yield this._add(options.deployment_name, options.node_id, oldDeployments, twinDeployments, network);
        });
    }
    delete_machine(options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(yield this.exists(options.deployment_name))) {
                throw Error(`There are no machine deployments with the name: ${options.deployment_name}`);
            }
            return yield this._deleteInstance(this.vm, options.deployment_name, options.name);
        });
    }
}
__decorate([
    expose,
    validateInput,
    checkBalance,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [MachinesModel]),
    __metadata("design:returntype", Promise)
], MachinesModule.prototype, "deploy", null);
__decorate([
    expose,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MachinesModule.prototype, "list", null);
__decorate([
    expose,
    validateInput,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [MachinesGetModel]),
    __metadata("design:returntype", Promise)
], MachinesModule.prototype, "get", null);
__decorate([
    expose,
    validateInput,
    checkBalance,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [MachinesDeleteModel]),
    __metadata("design:returntype", Promise)
], MachinesModule.prototype, "delete", null);
__decorate([
    expose,
    validateInput,
    checkBalance,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [MachinesModel]),
    __metadata("design:returntype", Promise)
], MachinesModule.prototype, "update", null);
__decorate([
    expose,
    validateInput,
    checkBalance,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [AddMachineModel]),
    __metadata("design:returntype", Promise)
], MachinesModule.prototype, "add_machine", null);
__decorate([
    expose,
    validateInput,
    checkBalance,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [DeleteMachineModel]),
    __metadata("design:returntype", Promise)
], MachinesModule.prototype, "delete_machine", null);
export { MachinesModule as machines };
