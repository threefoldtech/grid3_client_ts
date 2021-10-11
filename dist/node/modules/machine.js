"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Machine = void 0;
const workload_1 = require("../zos/workload");
const base_1 = require("./base");
const network_1 = require("../primitives/network");
const machine_1 = require("../high_level/machine");
class Machine extends base_1.BaseModule {
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
        this.vm = new machine_1.VirtualMachine(twin_id, url, mnemonic, rmbClient);
    }
    async deploy(options) {
        if (this.exists(options.name)) {
            throw Error(`Another machine deployment with the same name ${options.name} is already exist`);
        }
        const networkName = options.network.name;
        const network = new network_1.Network(networkName, options.network.ip_range, this.rmbClient);
        await network.load(true);
        const [twinDeployments, wgConfig] = await this.vm.create(options.name, options.node_id, options.flist, options.cpu, options.memory, options.rootfs_size, options.disks, options.public_ip, options.planetary, network, options.entrypoint, options.env, options.metadata, options.description);
        const contracts = await this.twinDeploymentHandler.handle(twinDeployments);
        this.save(options.name, contracts, wgConfig);
        return { contracts: contracts, wireguard_config: wgConfig };
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
        if (!this._getDeploymentNodeIds(options.name).includes(options.node_id)) {
            throw Error("node_id can't be changed");
        }
        const deploymentObj = (await this._get(options.name)).pop();
        const oldDeployment = this.deploymentFactory.fromObj(deploymentObj);
        for (const workload of oldDeployment.workloads) {
            if (workload.type !== workload_1.WorkloadTypes.network) {
                continue;
            }
            if (workload.name !== options.network.name) {
                throw Error("Network name can't be changed");
            }
        }
        const networkName = options.network.name;
        const network = new network_1.Network(networkName, options.network.ip_range, this.rmbClient);
        await network.load(true);
        const twinDeployment = await this.vm.update(oldDeployment, options.name, options.node_id, options.flist, options.cpu, options.memory, options.rootfs_size, options.disks, options.public_ip, options.planetary, network, options.entrypoint, options.env, options.metadata, options.description);
        console.log(JSON.stringify(twinDeployment));
        const contracts = await this.twinDeploymentHandler.handle([twinDeployment]);
        return { contracts: contracts };
    }
}
exports.Machine = Machine;
