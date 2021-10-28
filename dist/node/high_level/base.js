"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HighLevelBase = void 0;
const workload_1 = require("../zos/workload");
const netaddr_1 = require("netaddr");
const deployment_1 = require("../primitives/deployment");
const network_1 = require("../primitives/network");
const nodes_1 = require("../primitives/nodes");
const models_1 = require("../high_level/models");
const events_1 = require("../helpers/events");
class HighLevelBase {
    twin_id;
    url;
    mnemonic;
    rmbClient;
    storePath;
    constructor(twin_id, url, mnemonic, rmbClient, storePath) {
        this.twin_id = twin_id;
        this.url = url;
        this.mnemonic = mnemonic;
        this.rmbClient = rmbClient;
        this.storePath = storePath;
    }
    _filterWorkloads(deployment, names, types = [
        workload_1.WorkloadTypes.ipv4,
        workload_1.WorkloadTypes.zmachine,
        workload_1.WorkloadTypes.zmount,
        workload_1.WorkloadTypes.zdb,
        workload_1.WorkloadTypes.qsfs,
    ]) {
        let deletedMachineWorkloads = [];
        if (names.length === 0) {
            deletedMachineWorkloads = deployment.workloads.filter(item => item.type === workload_1.WorkloadTypes.zmachine);
        }
        if (names.length !== 0 && types.includes(workload_1.WorkloadTypes.zmachine)) {
            const Workloads = deployment.workloads.filter(item => item.type === workload_1.WorkloadTypes.zmachine);
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
            if (workload.type === workload_1.WorkloadTypes.network) {
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
    async _deleteMachineNetwork(deployment, remainingWorkloads, deletedMachineWorkloads, node_id) {
        const twinDeployments = [];
        const deletedNodes = [];
        const deletedIps = [];
        const deploymentFactory = new deployment_1.DeploymentFactory(this.twin_id, this.url, this.mnemonic);
        for (const workload of deletedMachineWorkloads) {
            const networkName = workload.data["network"].interfaces[0].network;
            const networkIpRange = (0, netaddr_1.Addr)(workload.data["network"].interfaces[0].ip).mask(16).toString();
            const network = new network_1.Network(networkName, networkIpRange, this.rmbClient, this.storePath, this.url);
            await network.load();
            const machineIp = workload.data["network"].interfaces[0].ip;
            events_1.events.emit("logs", `Deleting ip: ${machineIp} from node: ${node_id}, network ${network.name}`);
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
            const contract_id = network.deleteNode(node_id);
            if (contract_id === deployment.contract_id) {
                if (remainingWorkloads.length === 1) {
                    twinDeployments.push(new models_1.TwinDeployment(deployment, models_1.Operations.delete, 0, 0, network));
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
                    d = await deploymentFactory.fromObj(d);
                    if (d.contract_id !== contract_id) {
                        continue;
                    }
                    if (d.workloads.length === 1) {
                        twinDeployments.push(new models_1.TwinDeployment(d, models_1.Operations.delete, 0, 0, network));
                    }
                    else {
                        d.workloads = d.workloads.filter(item => item.name !== networkName);
                        twinDeployments.push(new models_1.TwinDeployment(d, models_1.Operations.update, 0, 0, network));
                    }
                }
            }
            // in case of the network got more accesspoints on different nodes this won't be valid
            if (network.nodes.length === 1 && network.getNodeReservedIps(network.nodes[0].node_id).length === 0) {
                const contract_id = network.deleteNode(network.nodes[0].node_id);
                for (let d of network.deployments) {
                    d = await deploymentFactory.fromObj(d);
                    if (d.contract_id !== contract_id) {
                        continue;
                    }
                    if (d.workloads.length === 1) {
                        twinDeployments.push(new models_1.TwinDeployment(d, models_1.Operations.delete, 0, 0, network));
                    }
                    else {
                        d.workloads = d.workloads.filter(item => item.name !== networkName);
                        twinDeployments.push(new models_1.TwinDeployment(d, models_1.Operations.update, 0, 0, network));
                    }
                }
            }
        }
        return [twinDeployments, remainingWorkloads, deletedNodes, deletedIps];
    }
    async _delete(deployment, names, types = [
        workload_1.WorkloadTypes.ipv4,
        workload_1.WorkloadTypes.zmachine,
        workload_1.WorkloadTypes.zmount,
        workload_1.WorkloadTypes.zdb,
        workload_1.WorkloadTypes.qsfs,
    ]) {
        if (types.includes(workload_1.WorkloadTypes.network)) {
            throw Error("network can't be deleted");
        }
        const nodes = new nodes_1.Nodes(this.url);
        const node_id = await nodes.getNodeIdFromContractId(deployment.contract_id, this.mnemonic);
        let twinDeployments = [];
        const deploymentFactory = new deployment_1.DeploymentFactory(this.twin_id, this.url, this.mnemonic);
        const numberOfWorkloads = deployment.workloads.length;
        deployment = await deploymentFactory.fromObj(deployment);
        const filteredWorkloads = this._filterWorkloads(deployment, names, types);
        let remainingWorkloads = filteredWorkloads[0];
        const deletedMachineWorkloads = filteredWorkloads[1];
        if (remainingWorkloads.length === 0) {
            twinDeployments.push(new models_1.TwinDeployment(deployment, models_1.Operations.delete, 0, 0));
        }
        const [newTwinDeployments, newRemainingWorkloads, deletedNodes, deletedIps] = await this._deleteMachineNetwork(deployment, remainingWorkloads, deletedMachineWorkloads, node_id);
        twinDeployments = twinDeployments.concat(newTwinDeployments);
        remainingWorkloads = newRemainingWorkloads;
        console.log(remainingWorkloads);
        if (remainingWorkloads.length !== 0 && remainingWorkloads.length < numberOfWorkloads) {
            let network = null;
            for (const workload of remainingWorkloads) {
                if (workload.type === workload_1.WorkloadTypes.network) {
                    network = new network_1.Network(workload.name, workload.data["ip_range"], this.rmbClient, this.storePath, this.url);
                    await network.load();
                    break;
                }
            }
            for (const deleteNode of deletedNodes) {
                network.deleteNode(deleteNode);
            }
            for (const deleteIp of deletedIps) {
                network.deleteReservedIp(node_id, deleteIp);
            }
            deployment.workloads = remainingWorkloads;
            twinDeployments.push(new models_1.TwinDeployment(deployment, models_1.Operations.update, 0, 0, network));
        }
        return twinDeployments;
    }
}
exports.HighLevelBase = HighLevelBase;
