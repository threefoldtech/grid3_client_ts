import { Addr } from "netaddr";

import { WorkloadTypes, Workload } from "../zos/workload";

import { BaseModule } from "./base";
import { MachinesModel, MachinesDeleteModel, MachinesGetModel, AddMachineModel, DeleteMachineModel } from "./models";
import { Network } from "../primitives/network";
import { VMHL } from "../high_level/machine";
import { MessageBusClientInterface } from "ts-rmb-client-base";
import { TwinDeployment } from "../high_level/models";

class MachineModule extends BaseModule {
    fileName = "machines.json";
    workloadTypes = [WorkloadTypes.zmachine, WorkloadTypes.zmount, WorkloadTypes.qsfs, WorkloadTypes.ipv4];
    vm: VMHL;
    constructor(
        public twin_id: number,
        public url: string,
        public mnemonic: string,
        public rmbClient: MessageBusClientInterface,
    ) {
        super(twin_id, url, mnemonic, rmbClient);
        this.vm = new VMHL(twin_id, url, mnemonic, rmbClient);
    }

    async _createDeloyment(options: MachinesModel): Promise<[TwinDeployment[], Network, string]> {
        const networkName = options.network.name;
        const network = new Network(networkName, options.network.ip_range, this.rmbClient);
        await network.load(true);

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
                this.projectName,
            );
            twinDeployments = twinDeployments.concat(TDeployments);
            if (wgConfig) {
                wireguardConfig = wgConfig;
            }
        }
        return [twinDeployments, network, wireguardConfig];
    }

    _getMachineWorkload(deployments): Workload {
        for (const deployment of deployments) {
            for (const workload of deployment.workloads) {
                if (workload.type === WorkloadTypes.zmachine) {
                    return workload;
                }
            }
        }
    }

    async deploy(options: MachinesModel) {
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

    async get(options: MachinesGetModel) {
        return await this._get(options.name);
    }

    async delete(options: MachinesDeleteModel) {
        return await this._delete(options.name);
    }

    async update(options: MachinesModel) {
        if (!this.exists(options.name)) {
            throw Error(`There is no machine with name: ${options.name}`);
        }

        const oldDeployments = await this._get(options.name);
        const workload = this._getMachineWorkload(oldDeployments);
        const networkName = workload.data["network"].interfaces[0].network;
        const networkIpRange = Addr(workload.data["network"].interfaces[0].ip).mask(16).toString();
        if (networkName !== options.network.name || networkIpRange !== options.network.ip_range) {
            throw Error("Network name and ip_range can't be changed");
        }

        const [twinDeployments, network, _] = await this._createDeloyment(options);
        return await this._update(this.vm, options.name, oldDeployments, twinDeployments, network);
    }

    async addMachine(options: AddMachineModel) {
        if (!this.exists(options.deployment_name)) {
            throw Error(`There is no machines deployment with name: ${options.deployment_name}`);
        }
        const oldDeployments = await this._get(options.deployment_name);
        const workload = this._getMachineWorkload(oldDeployments);
        const networkName = workload.data["network"].interfaces[0].network;
        const networkIpRange = Addr(workload.data["network"].interfaces[0].ip).mask(16).toString();
        const network = new Network(networkName, networkIpRange, this.rmbClient);
        await network.load(true);

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
            this.projectName,
        );
        return await this._add(options.deployment_name, options.node_id, oldDeployments, twinDeployments, network);
    }

    async deleteMachine(options: DeleteMachineModel) {
        if (!this.exists(options.deployment_name)) {
            throw Error(`There is no machines deployment with name: ${options.deployment_name}`);
        }
        return await this._deleteInstance(this.vm, options.deployment_name, options.name);
    }
}

export { MachineModule };
