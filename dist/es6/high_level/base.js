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
import { events } from "../helpers/events";
import { Operations, TwinDeployment } from "../high_level/models";
import { DeploymentFactory } from "../primitives/deployment";
import { Network } from "../primitives/network";
import { Nodes } from "../primitives/nodes";
import { WorkloadTypes } from "../zos/workload";
class HighLevelBase {
    constructor(config) {
        this.config = config;
    }
    _filterWorkloads(deployment, names, types = [
        WorkloadTypes.ip,
        WorkloadTypes.ipv4,
        WorkloadTypes.zmachine,
        WorkloadTypes.zmount,
        WorkloadTypes.zdb,
        WorkloadTypes.qsfs,
        WorkloadTypes.gatewayfqdnproxy,
        WorkloadTypes.gatewaynameproxy,
    ]) {
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
    _deleteMachineNetwork(deployment, remainingWorkloads, deletedMachineWorkloads, node_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const twinDeployments = [];
            const deletedNodes = [];
            const deletedIps = [];
            const deploymentFactory = new DeploymentFactory(this.config);
            const loadedNetworks = {};
            for (const workload of deletedMachineWorkloads) {
                const networkName = workload.data["network"].interfaces[0].network;
                const networkIpRange = Addr(workload.data["network"].interfaces[0].ip).mask(16).toString();
                let network;
                if (Object.keys(loadedNetworks).includes(networkName)) {
                    network = loadedNetworks[networkName];
                }
                else {
                    network = new Network(networkName, networkIpRange, this.config);
                    yield network.load();
                    loadedNetworks[networkName] = network;
                }
                const machineIp = workload.data["network"].interfaces[0].ip;
                events.emit("logs", `Deleting ip: ${machineIp} from node: ${node_id}, network ${network.name}`);
                const deletedIp = network.deleteReservedIp(node_id, machineIp);
                if (remainingWorkloads.length === 0) {
                    twinDeployments.push(new TwinDeployment(deployment, Operations.delete, 0, 0, network));
                }
                const numberOfIps = network.getNodeReservedIps(node_id).length;
                if (numberOfIps !== 0) {
                    console.log(`network ${network.name} still has ${numberOfIps} ip(s) reserved`);
                    deletedIps.push(deletedIp);
                    continue;
                }
                const hasAccessPoint = network.hasAccessPoint(node_id);
                if (hasAccessPoint && network.nodes.length !== 1) {
                    console.log(`network ${network.name} still has access point:${hasAccessPoint} and number of nodes ${network.nodes.length}`);
                    deletedIps.push(deletedIp);
                    continue;
                }
                const contract_id = yield network.deleteNode(node_id);
                if (contract_id === deployment.contract_id) {
                    if (remainingWorkloads.length === 1) {
                        twinDeployments.push(new TwinDeployment(deployment, Operations.delete, 0, 0, network));
                        remainingWorkloads = [];
                    }
                    else {
                        remainingWorkloads = remainingWorkloads.filter(item => item.name !== networkName);
                        deletedIps.push(deletedIp);
                        deletedNodes.push(node_id);
                    }
                }
                else {
                    // check that the deployment doesn't have another workloads
                    for (let d of network.deployments) {
                        d = yield deploymentFactory.fromObj(d);
                        if (d.contract_id !== contract_id) {
                            continue;
                        }
                        if (d.workloads.length === 1) {
                            twinDeployments.push(new TwinDeployment(d, Operations.delete, 0, 0, network));
                        }
                        else {
                            d.workloads = d.workloads.filter(item => item.name !== networkName);
                            twinDeployments.push(new TwinDeployment(d, Operations.update, 0, 0, network));
                        }
                    }
                }
                // in case of the network got more accesspoints on different nodes this won't be valid
                if (network.nodes.length === 1 && network.getNodeReservedIps(network.nodes[0].node_id).length === 0) {
                    const contract_id = yield network.deleteNode(network.nodes[0].node_id);
                    for (let d of network.deployments) {
                        d = yield deploymentFactory.fromObj(d);
                        if (d.contract_id !== contract_id) {
                            continue;
                        }
                        if (d.workloads.length === 1) {
                            twinDeployments.push(new TwinDeployment(d, Operations.delete, 0, 0, network));
                        }
                        else {
                            d.workloads = d.workloads.filter(item => item.name !== networkName);
                            twinDeployments.push(new TwinDeployment(d, Operations.update, 0, 0, network));
                        }
                    }
                }
            }
            return [twinDeployments, remainingWorkloads, deletedNodes, deletedIps];
        });
    }
    _delete(deployment, names, types = [
        WorkloadTypes.ip,
        WorkloadTypes.ipv4,
        WorkloadTypes.zmachine,
        WorkloadTypes.zmount,
        WorkloadTypes.zdb,
        WorkloadTypes.qsfs,
        WorkloadTypes.gatewayfqdnproxy,
        WorkloadTypes.gatewaynameproxy,
    ]) {
        return __awaiter(this, void 0, void 0, function* () {
            if (types.includes(WorkloadTypes.network)) {
                throw Error("Network workload can't be deleted");
            }
            const nodes = new Nodes(this.config.graphqlURL, this.config.rmbClient["proxyURL"]);
            const node_id = yield nodes.getNodeIdFromContractId(deployment.contract_id, this.config.mnemonic);
            let twinDeployments = [];
            const deploymentFactory = new DeploymentFactory(this.config);
            const numberOfWorkloads = deployment.workloads.length;
            deployment = yield deploymentFactory.fromObj(deployment);
            const filteredWorkloads = this._filterWorkloads(deployment, names, types);
            let remainingWorkloads = filteredWorkloads[0];
            const deletedMachineWorkloads = filteredWorkloads[1];
            if (remainingWorkloads.length === 0 && deletedMachineWorkloads.length === 0) {
                twinDeployments.push(new TwinDeployment(deployment, Operations.delete, 0, 0));
            }
            const [newTwinDeployments, newRemainingWorkloads, deletedNodes, deletedIps] = yield this._deleteMachineNetwork(deployment, remainingWorkloads, deletedMachineWorkloads, node_id);
            twinDeployments = twinDeployments.concat(newTwinDeployments);
            remainingWorkloads = newRemainingWorkloads;
            if (remainingWorkloads.length !== 0 && remainingWorkloads.length < numberOfWorkloads) {
                let network = null;
                for (const workload of remainingWorkloads) {
                    if (workload.type === WorkloadTypes.network) {
                        network = new Network(workload.name, workload.data["ip_range"], this.config);
                        yield network.load();
                        break;
                    }
                }
                for (const deleteNode of deletedNodes) {
                    yield network.deleteNode(deleteNode);
                }
                for (const deleteIp of deletedIps) {
                    network.deleteReservedIp(node_id, deleteIp);
                }
                deployment.workloads = remainingWorkloads;
                twinDeployments.push(new TwinDeployment(deployment, Operations.update, 0, 0, network));
            }
            return twinDeployments;
        });
    }
}
export { HighLevelBase };
