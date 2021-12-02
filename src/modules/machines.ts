import { Addr } from "netaddr";

import { WorkloadTypes, Workload } from "../zos/workload";

import { BaseModule } from "./base";
import { MachinesModel, MachinesDeleteModel, MachinesGetModel, AddMachineModel, DeleteMachineModel } from "./models";
import { Network } from "../primitives/network";
import { VMHL } from "../high_level/machine";
import { TwinDeployment } from "../high_level/models";
import { expose } from "../helpers/expose";
import { GridClientConfig } from "../config";
import { validateInput } from "../helpers/validator";
import { checkBalance } from "./utils";

class MachineModule extends BaseModule {
    moduleName = "machines";
    workloadTypes = [WorkloadTypes.zmachine, WorkloadTypes.zmount, WorkloadTypes.qsfs, WorkloadTypes.ipv4];
    vm: VMHL;
    constructor(public config: GridClientConfig) {
        super(config);
        this.vm = new VMHL(config);
    }

    async _createDeloyment(options: MachinesModel): Promise<[TwinDeployment[], Network, string]> {
        const networkName = options.network.name;
        const network = new Network(networkName, options.network.ip_range, this.config);
        await network.load();

        let twinDeployments = [];
        let wireguardConfig = "";

        for (const machine of options.machines) {
            const [TDeployments, wgConfig] = await this.vm.create(
                machine.name,
                machine.node_id,
                machine.flist,
                machine.cpu,
                machine.memory,
                machine.rootfs_size,
                machine.disks,
                machine.public_ip,
                machine.planetary,
                network,
                machine.entrypoint,
                machine.env,
                options.metadata,
                options.description,
                machine.qsfs_disks,
                this.config.projectName,
            );
            twinDeployments = twinDeployments.concat(TDeployments);
            if (wgConfig) {
                wireguardConfig = wgConfig;
            }
        }
        return [twinDeployments, network, wireguardConfig];
    }

    @expose
    @validateInput
    @checkBalance
    async deploy(options: MachinesModel) {
        if (await this.exists(options.name)) {
            throw Error(`Another machine deployment with the same name ${options.name} already exists`);
        }

        const [twinDeployments, _, wireguardConfig] = await this._createDeloyment(options);
        const contracts = await this.twinDeploymentHandler.handle(twinDeployments);
        await this.save(options.name, contracts, wireguardConfig);
        return { contracts: contracts, wireguard_config: wireguardConfig };
    }

    @expose
    @validateInput
    async list() {
        return await this._list();
    }

    async getObj(deploymentName: string) {
        const deployments = await this._get(deploymentName);
        const workloads = this._getWorkloadsByTypes(deployments, [WorkloadTypes.zmachine]);

        return workloads.map(workload => this._getZmachineData(deployments, workload));
    }

    @expose
    @validateInput
    async get(options: MachinesGetModel) {
        return await this._get(options.name);
    }

    @expose
    @validateInput
    @checkBalance
    async delete(options: MachinesDeleteModel) {
        return await this._delete(options.name);
    }

    @expose
    @validateInput
    @checkBalance
    async update(options: MachinesModel) {
        if (!(await this.exists(options.name))) {
            throw Error(`There is no machine with the name: ${options.name}`);
        }

        const oldDeployments = await this._get(options.name);
        const workload = this._getWorkloadsByTypes(oldDeployments, [WorkloadTypes.zmachine])[0];
        const networkName = workload.data["network"].interfaces[0].network;
        const networkIpRange = Addr(workload.data["network"].interfaces[0].ip).mask(16).toString();
        if (networkName !== options.network.name || networkIpRange !== options.network.ip_range) {
            throw Error("Network name and ip_range can't be changed");
        }

        const [twinDeployments, network, _] = await this._createDeloyment(options);
        return await this._update(this.vm, options.name, oldDeployments, twinDeployments, network);
    }

    @expose
    @validateInput
    @checkBalance
    async add_machine(options: AddMachineModel) {
        if (!(await this.exists(options.deployment_name))) {
            throw Error(`There are no machine deployments with the name: ${options.deployment_name}`);
        }
        const oldDeployments = await this._get(options.deployment_name);
        const workload = this._getWorkloadsByTypes(oldDeployments, [WorkloadTypes.zmachine])[0];
        const networkName = workload.data["network"].interfaces[0].network;
        const networkIpRange = Addr(workload.data["network"].interfaces[0].ip).mask(16).toString();
        const network = new Network(networkName, networkIpRange, this.config);
        await network.load();

        const [twinDeployments, wgConfig] = await this.vm.create(
            options.name,
            options.node_id,
            options.flist,
            options.cpu,
            options.memory,
            options.rootfs_size,
            options.disks,
            options.public_ip,
            options.planetary,
            network,
            options.entrypoint,
            options.env,
            workload.metadata,
            workload.description,
            options.qsfs_disks,
            this.config.projectName,
        );
        return await this._add(options.deployment_name, options.node_id, oldDeployments, twinDeployments, network);
    }

    @expose
    @validateInput
    @checkBalance
    async delete_machine(options: DeleteMachineModel) {
        if (!(await this.exists(options.deployment_name))) {
            throw Error(`There are no machine deployments with the name: ${options.deployment_name}`);
        }
        return await this._deleteInstance(this.vm, options.deployment_name, options.name);
    }
}

export { MachineModule as machines };
