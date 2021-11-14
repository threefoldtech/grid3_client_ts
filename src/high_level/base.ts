import { Deployment } from "../zos/deployment";
import { WorkloadTypes, Workload } from "../zos/workload";
import { Addr } from "netaddr";

import { DeploymentFactory } from "../primitives/deployment";
import { Network } from "../primitives/network";
import { Nodes } from "../primitives/nodes";
import { TwinDeployment, Operations } from "../high_level/models";
import { events } from "../helpers/events";
import { GridClientConfig } from "../config";
class HighLevelBase {
    constructor(public config: GridClientConfig) {}

    _filterWorkloads(
        deployment: Deployment,
        names: string[],
        types: WorkloadTypes[] = [
            WorkloadTypes.ipv4,
            WorkloadTypes.zmachine,
            WorkloadTypes.zmount,
            WorkloadTypes.zdb,
            WorkloadTypes.qsfs,
            WorkloadTypes.gatewayfqdnproxy,
            WorkloadTypes.gatewaynameproxy,
        ],
    ): [Workload[], Workload[]] {
        let deletedMachineWorkloads = [];
        if (names.length === 0) {
            deletedMachineWorkloads = deployment.workloads.filter(item => item.type === WorkloadTypes.zmachine);
        }

        if (names.length !== 0 && types.includes(WorkloadTypes.zmachine)) {
            const Workloads = deployment.workloads.filter(item => item.type === WorkloadTypes.zmachine);
            for (const workload of Workloads) {
                if (!names.includes(workload.name)) {
                    continue;
                }
                for (const mount of workload.data["mounts"]) {
                    names.push(mount.name);
                }
                names.push(workload.data["network"].public_ip);
                deletedMachineWorkloads.push(workload);
            }
        }

        const remainingWorkloads = [];
        for (const workload of deployment.workloads) {
            if (workload.type === WorkloadTypes.network) {
                remainingWorkloads.push(workload);
                continue;
            }
            if (!types.includes(workload.type)) {
                remainingWorkloads.push(workload);
                continue;
            }
            if (names.length !== 0 && !names.includes(workload.name)) {
                remainingWorkloads.push(workload);
            }
        }
        return [remainingWorkloads, deletedMachineWorkloads];
    }

    async _deleteMachineNetwork(
        deployment: Deployment,
        remainingWorkloads: Workload[],
        deletedMachineWorkloads: Workload[],
        node_id: number,
    ): Promise<[TwinDeployment[], Workload[], number[], string[]]> {
        const twinDeployments = [];
        const deletedNodes = [];
        const deletedIps = [];
        const deploymentFactory = new DeploymentFactory(this.config);
        for (const workload of deletedMachineWorkloads) {
            const networkName = workload.data["network"].interfaces[0].network;
            const networkIpRange = Addr(workload.data["network"].interfaces[0].ip).mask(16).toString();
            const network = new Network(networkName, networkIpRange, this.config);
            await network.load();

            const machineIp = workload.data["network"].interfaces[0].ip;
            events.emit("logs", `Deleting ip: ${machineIp} from node: ${node_id}, network ${network.name}`);
            //TODO: Reproduce: Sometimes the network is free and it keeps getting wrong result here
            // so it doesn't delete the deployment, but it updates the deployment.
            const deletedIp = network.deleteReservedIp(node_id, machineIp);
            if (network.getNodeReservedIps(node_id).length !== 0) {
                deletedIps.push(deletedIp);
                continue;
            }
            if (network.hasAccessPoint(node_id) && network.nodes.length !== 1) {
                deletedIps.push(deletedIp);
                continue;
            }

            const contract_id = await network.deleteNode(node_id);
            if (contract_id === deployment.contract_id) {
                if (remainingWorkloads.length === 1) {
                    twinDeployments.push(new TwinDeployment(deployment, Operations.delete, 0, 0, network));
                    remainingWorkloads = [];
                } else {
                    remainingWorkloads = remainingWorkloads.filter(item => item.name !== networkName);
                    deletedIps.push(deletedIp);
                    deletedNodes.push(node_id);
                }
            } else {
                // check that the deployment doesn't have another workloads
                for (let d of network.deployments) {
                    d = await deploymentFactory.fromObj(d);
                    if (d.contract_id !== contract_id) {
                        continue;
                    }
                    if (d.workloads.length === 1) {
                        twinDeployments.push(new TwinDeployment(d, Operations.delete, 0, 0, network));
                    } else {
                        d.workloads = d.workloads.filter(item => item.name !== networkName);
                        twinDeployments.push(new TwinDeployment(d, Operations.update, 0, 0, network));
                    }
                }
            }
            // in case of the network got more accesspoints on different nodes this won't be valid
            if (network.nodes.length === 1 && network.getNodeReservedIps(network.nodes[0].node_id).length === 0) {
                const contract_id = await network.deleteNode(network.nodes[0].node_id);
                for (let d of network.deployments) {
                    d = await deploymentFactory.fromObj(d);
                    if (d.contract_id !== contract_id) {
                        continue;
                    }
                    if (d.workloads.length === 1) {
                        twinDeployments.push(new TwinDeployment(d, Operations.delete, 0, 0, network));
                    } else {
                        d.workloads = d.workloads.filter(item => item.name !== networkName);
                        twinDeployments.push(new TwinDeployment(d, Operations.update, 0, 0, network));
                    }
                }
            }
        }
        return [twinDeployments, remainingWorkloads, deletedNodes, deletedIps];
    }

    async _delete(
        deployment: Deployment,
        names: string[],
        types: WorkloadTypes[] = [
            WorkloadTypes.ipv4,
            WorkloadTypes.zmachine,
            WorkloadTypes.zmount,
            WorkloadTypes.zdb,
            WorkloadTypes.qsfs,
            WorkloadTypes.gatewayfqdnproxy,
            WorkloadTypes.gatewaynameproxy,
        ],
    ): Promise<TwinDeployment[]> {
        if (types.includes(WorkloadTypes.network)) {
            throw Error("network can't be deleted");
        }
        const nodes = new Nodes(this.config.graphqlURL, this.config.rmbClient["proxyURL"]);
        const node_id = await nodes.getNodeIdFromContractId(deployment.contract_id, this.config.mnemonic);
        let twinDeployments = [];
        const deploymentFactory = new DeploymentFactory(this.config);

        const numberOfWorkloads = deployment.workloads.length;
        deployment = await deploymentFactory.fromObj(deployment);
        const filteredWorkloads = this._filterWorkloads(deployment, names, types);
        let remainingWorkloads = filteredWorkloads[0];
        const deletedMachineWorkloads = filteredWorkloads[1];

        if (remainingWorkloads.length === 0) {
            twinDeployments.push(new TwinDeployment(deployment, Operations.delete, 0, 0));
        }
        const [newTwinDeployments, newRemainingWorkloads, deletedNodes, deletedIps] = await this._deleteMachineNetwork(
            deployment,
            remainingWorkloads,
            deletedMachineWorkloads,
            node_id,
        );
        twinDeployments = twinDeployments.concat(newTwinDeployments);
        remainingWorkloads = newRemainingWorkloads;
        if (remainingWorkloads.length !== 0 && remainingWorkloads.length < numberOfWorkloads) {
            let network = null;
            for (const workload of remainingWorkloads) {
                if (workload.type === WorkloadTypes.network) {
                    network = new Network(workload.name, workload.data["ip_range"], this.config);
                    await network.load();
                    break;
                }
            }
            for (const deleteNode of deletedNodes) {
                await network.deleteNode(deleteNode);
            }
            for (const deleteIp of deletedIps) {
                network.deleteReservedIp(node_id, deleteIp);
            }
            deployment.workloads = remainingWorkloads;
            twinDeployments.push(new TwinDeployment(deployment, Operations.update, 0, 0, network));
        }
        return twinDeployments;
    }
}

export { HighLevelBase };
