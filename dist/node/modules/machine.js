"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MachineModule = void 0;
const netaddr_1 = require("netaddr");
const workload_1 = require("../zos/workload");
const base_1 = require("./base");
const network_1 = require("../primitives/network");
const machine_1 = require("../high_level/machine");
class MachineModule extends base_1.BaseModule {
    twin_id;
    url;
    mnemonic;
    rmbClient;
    fileName = "machines.json";
    vm;
    constructor(twin_id, url, mnemonic, rmbClient) {
        super(twin_id, url, mnemonic, rmbClient);
        this.twin_id = twin_id;
        this.url = url;
        this.mnemonic = mnemonic;
        this.rmbClient = rmbClient;
        this.vm = new machine_1.VMHL(twin_id, url, mnemonic, rmbClient);
    }
    async _createDeloyment(options) {
        const networkName = options.network.name;
        const network = new network_1.Network(networkName, options.network.ip_range, this.rmbClient);
        await network.load(true);
        let twinDeployments = [];
        let wireguardConfig = "";
        for (const machine of options.machines) {
            const [TDeployments, wgConfig] = await this.vm.create(machine.name, machine.node_id, machine.flist, machine.cpu, machine.memory, machine.rootfs_size, machine.disks, machine.public_ip, machine.planetary, network, machine.entrypoint, machine.env, options.metadata, options.description);
            twinDeployments = twinDeployments.concat(TDeployments);
            if (wgConfig) {
                wireguardConfig = wgConfig;
            }
        }
        ;
        return [twinDeployments, network, wireguardConfig];
    }
    _getMachineWorkload(deployments) {
        for (const deployment of deployments) {
            for (const workload of deployment.workloads) {
                if (workload.type === workload_1.WorkloadTypes.zmachine) {
                    return workload;
                }
            }
        }
    }
    async deploy(options) {
        if (this.exists(options.name)) {
            throw Error(`Another machine deployment with the same name ${options.name} is already exist`);
        }
        const [twinDeployments, _, wireguardConfig] = await this._createDeloyment(options);
        const contracts = await this.twinDeploymentHandler.handle(twinDeployments);
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
            throw Error(`There is no machine with name: ${options.name}`);
        }
        const oldDeployments = await this._get(options.name);
        const workload = this._getMachineWorkload(oldDeployments);
        const networkName = workload.data["network"].interfaces[0].network;
        const networkIpRange = (0, netaddr_1.Addr)(workload.data["network"].interfaces[0].ip).mask(16).toString();
        if (networkName !== options.network.name || networkIpRange !== options.network.ip_range) {
            throw Error("Network name and ip_range can't be changed");
        }
        const [twinDeployments, network, _] = await this._createDeloyment(options);
        return await this._update(this.vm, options.name, oldDeployments, twinDeployments, network);
    }
    async addMachine(options) {
        if (!this.exists(options.deployment_name)) {
            throw Error(`There is no machines deployment with name: ${options.deployment_name}`);
        }
        const oldDeployments = await this._get(options.deployment_name);
        const workload = this._getMachineWorkload(oldDeployments);
        const networkName = workload.data["network"].interfaces[0].network;
        const networkIpRange = (0, netaddr_1.Addr)(workload.data["network"].interfaces[0].ip).mask(16).toString();
        const network = new network_1.Network(networkName, networkIpRange, this.rmbClient);
        await network.load(true);
        const [twinDeployments, wgConfig] = await this.vm.create(options.name, options.node_id, options.flist, options.cpu, options.memory, options.rootfs_size, options.disks, options.public_ip, options.planetary, network, options.entrypoint, options.env, workload.metadata, workload.description);
        return await this._add(options.deployment_name, options.node_id, oldDeployments, twinDeployments, network);
    }
    async deleteMachine(options) {
        if (!this.exists(options.deployment_name)) {
            throw Error(`There is no machines deployment with name: ${options.deployment_name}`);
        }
        return await this._deleteInstance(this.vm, options.deployment_name, options.name);
    }
}
exports.MachineModule = MachineModule;
