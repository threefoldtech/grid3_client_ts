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
exports.machines = void 0;
const netaddr_1 = require("netaddr");
const expose_1 = require("../helpers/expose");
const validator_1 = require("../helpers/validator");
const machine_1 = require("../high_level/machine");
const network_1 = require("../primitives/network");
const workload_1 = require("../zos/workload");
const base_1 = require("./base");
const models_1 = require("./models");
const utils_1 = require("./utils");
class MachinesModule extends base_1.BaseModule {
    config;
    moduleName = "machines";
    workloadTypes = [
        workload_1.WorkloadTypes.zmachine,
        workload_1.WorkloadTypes.zmount,
        workload_1.WorkloadTypes.qsfs,
        workload_1.WorkloadTypes.ip,
        workload_1.WorkloadTypes.ipv4,
    ]; // TODO: remove deprecated
    vm;
    constructor(config) {
        super(config);
        this.config = config;
        this.vm = new machine_1.VMHL(config);
    }
    async _createDeployment(options) {
        const network = new network_1.Network(options.network.name, options.network.ip_range, this.config);
        await network.load();
        let twinDeployments = [];
        let wireguardConfig = "";
        for (const machine of options.machines) {
            const [TDeployments, wgConfig] = await this.vm.create(machine.name, machine.node_id, machine.flist, machine.cpu, machine.memory, machine.rootfs_size, machine.disks, machine.public_ip, machine.public_ip6, machine.planetary, network, machine.entrypoint, machine.env, options.metadata, options.description, machine.qsfs_disks, this.config.projectName, options.network.addAccess, machine.ip, machine.corex);
            twinDeployments = twinDeployments.concat(TDeployments);
            if (wgConfig) {
                wireguardConfig = wgConfig;
            }
        }
        return [twinDeployments, network, wireguardConfig];
    }
    async deploy(options) {
        if (await this.exists(options.name)) {
            throw Error(`Another machine deployment with the same name ${options.name} already exists`);
        }
        const [twinDeployments, , wireguardConfig] = await this._createDeployment(options);
        const contracts = await this.twinDeploymentHandler.handle(twinDeployments);
        await this.save(options.name, contracts, wireguardConfig);
        return { contracts: contracts, wireguard_config: wireguardConfig };
    }
    async list() {
        return await this._list();
    }
    async getObj(deploymentName) {
        const deployments = await this._get(deploymentName);
        const workloads = await this._getWorkloadsByTypes(deploymentName, deployments, [workload_1.WorkloadTypes.zmachine]);
        const promises = workloads.map(async (workload) => await this._getZmachineData(deploymentName, deployments, workload));
        return await Promise.all(promises);
    }
    async get(options) {
        return await this._get(options.name);
    }
    async delete(options) {
        return await this._delete(options.name);
    }
    async update(options) {
        if (!(await this.exists(options.name))) {
            throw Error(`There is no machine with the name: ${options.name}`);
        }
        const oldDeployments = await this._get(options.name);
        const workload = (await this._getWorkloadsByTypes(options.name, oldDeployments, [workload_1.WorkloadTypes.zmachine]))[0];
        const networkName = workload.data["network"].interfaces[0].network;
        const networkIpRange = (0, netaddr_1.Addr)(workload.data["network"].interfaces[0].ip).mask(16).toString();
        if (networkName !== options.network.name || networkIpRange !== options.network.ip_range) {
            throw Error("Network name and ip_range can't be changed");
        }
        const [twinDeployments, network] = await this._createDeployment(options);
        return await this._update(this.vm, options.name, oldDeployments, twinDeployments, network);
    }
    async add_machine(options) {
        if (!(await this.exists(options.deployment_name))) {
            throw Error(`There are no machine deployments with the name: ${options.deployment_name}`);
        }
        const oldDeployments = await this._get(options.deployment_name);
        const workload = (await this._getWorkloadsByTypes(options.deployment_name, oldDeployments, [workload_1.WorkloadTypes.zmachine]))[0];
        const networkName = workload.data["network"].interfaces[0].network;
        const networkIpRange = (0, netaddr_1.Addr)(workload.data["network"].interfaces[0].ip).mask(16).toString();
        const network = new network_1.Network(networkName, networkIpRange, this.config);
        await network.load();
        const [twinDeployments] = await this.vm.create(options.name, options.node_id, options.flist, options.cpu, options.memory, options.rootfs_size, options.disks, options.public_ip, options.public_ip6, options.planetary, network, options.entrypoint, options.env, workload.metadata, workload.description, options.qsfs_disks, this.config.projectName, false, options.ip, options.corex);
        return await this._add(options.deployment_name, options.node_id, oldDeployments, twinDeployments, network);
    }
    async delete_machine(options) {
        if (!(await this.exists(options.deployment_name))) {
            throw Error(`There are no machine deployments with the name: ${options.deployment_name}`);
        }
        return await this._deleteInstance(this.vm, options.deployment_name, options.name);
    }
}
__decorate([
    expose_1.expose,
    validator_1.validateInput,
    utils_1.checkBalance,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [models_1.MachinesModel]),
    __metadata("design:returntype", Promise)
], MachinesModule.prototype, "deploy", null);
__decorate([
    expose_1.expose,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MachinesModule.prototype, "list", null);
__decorate([
    expose_1.expose,
    validator_1.validateInput,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [models_1.MachinesGetModel]),
    __metadata("design:returntype", Promise)
], MachinesModule.prototype, "get", null);
__decorate([
    expose_1.expose,
    validator_1.validateInput,
    utils_1.checkBalance,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [models_1.MachinesDeleteModel]),
    __metadata("design:returntype", Promise)
], MachinesModule.prototype, "delete", null);
__decorate([
    expose_1.expose,
    validator_1.validateInput,
    utils_1.checkBalance,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [models_1.MachinesModel]),
    __metadata("design:returntype", Promise)
], MachinesModule.prototype, "update", null);
__decorate([
    expose_1.expose,
    validator_1.validateInput,
    utils_1.checkBalance,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [models_1.AddMachineModel]),
    __metadata("design:returntype", Promise)
], MachinesModule.prototype, "add_machine", null);
__decorate([
    expose_1.expose,
    validator_1.validateInput,
    utils_1.checkBalance,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [models_1.DeleteMachineModel]),
    __metadata("design:returntype", Promise)
], MachinesModule.prototype, "delete_machine", null);
exports.machines = MachinesModule;
