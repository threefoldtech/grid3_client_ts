import { WorkloadTypes } from "../zos/workload";

import { BaseModule } from "./base";
import { Machines, MachinesDelete, MachinesGet } from "./models";
import { Network } from "../primitives/network";
import { VirtualMachine } from "../high_level/machine";
import { MessageBusClientInterface } from "ts-rmb-client-base";


class Machine extends BaseModule {
    fileName = "machines.json";
    vm: VirtualMachine;
    constructor(public twin_id: number, public url: string, public mnemonic: string, public rmbClient: MessageBusClientInterface) {
        super(twin_id, url, mnemonic, rmbClient);
        this.vm = new VirtualMachine(twin_id, url, mnemonic, rmbClient);
    }

    async deploy(options: Machines) {
        if (this.exists(options.name)) {
            throw Error(`Another machine deployment with the same name ${options.name} is already exist`);
        }

        const networkName = options.network.name;
        const network = new Network(networkName, options.network.ip_range, this.rmbClient);
        await network.load(true);

        const [twinDeployments, wgConfig] = await this.vm.create(
            options.name,
            options.node_id,
            options.flist,
            options.cpu,
            options.memory,
            options.disks,
            options.public_ip,
            network,
            options.entrypoint,
            options.env,
            options.metadata,
            options.description,
        );

        const contracts = await this.twinDeploymentHandler.handle(twinDeployments);
        this.save(options.name, contracts, wgConfig);
        return { contracts: contracts, wireguard_config: wgConfig };
    }

    list() {
        return this._list();
    }

    async get(options: MachinesGet) {
        return await this._get(options.name);
    }

    async delete(options: MachinesDelete) {
        return await this._delete(options.name);
    }

    async update(options: Machines) {
        if (!this.exists(options.name)) {
            throw Error(`There is no machine with name: ${options.name}`);
        }
        if (!this._getDeploymentNodeIds(options.name).includes(options.node_id)) {
            throw Error("node_id can't be changed");
        }
        const deploymentObj = (await this._get(options.name)).pop();
        const oldDeployment = this.deploymentFactory.fromObj(deploymentObj);

        for (const workload of oldDeployment.workloads) {
            if (workload.type !== WorkloadTypes.network) {
                continue;
            }
            if (workload.name !== options.network.name) {
                throw Error("Network name can't be changed");
            }
        }

        const networkName = options.network.name;
        const network = new Network(networkName, options.network.ip_range, this.rmbClient);
        await network.load(true);

        const twinDeployment = await this.vm.update(
            oldDeployment,
            options.name,
            options.node_id,
            options.flist,
            options.cpu,
            options.memory,
            options.disks,
            options.public_ip,
            network,
            options.entrypoint,
            options.env,
            options.metadata,
            options.description,
        );

        console.log(JSON.stringify(twinDeployment));
        const contracts = await this.twinDeploymentHandler.handle([twinDeployment]);
        return { contracts: contracts };
    }
}

export { Machine };
