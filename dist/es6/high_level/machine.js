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
import { WorkloadTypes } from "../zos/workload";
import { TwinDeployment, Operations } from "./models";
import { HighLevelBase } from "./base";
import { Disk, VM, IPv4, DeploymentFactory, getAccessNodes } from "../primitives/index";
import { randomChoice } from "../helpers/utils";
class VirtualMachine extends HighLevelBase {
    create(name, nodeId, flist, cpu, memory, disks, publicIp, network, entrypoint, env, metadata = "", description = "") {
        return __awaiter(this, void 0, void 0, function* () {
            const deployments = [];
            const workloads = [];
            // disks
            const diskMounts = [];
            for (const d of disks) {
                const disk = new Disk();
                workloads.push(disk.create(d.size, d.name, metadata, description));
                diskMounts.push(disk.createMount(d.name, d.mountpoint));
            }
            // ipv4
            let ipName = "";
            let publicIps = 0;
            if (publicIp) {
                const ipv4 = new IPv4();
                ipName = `${name}_pubip`;
                workloads.push(ipv4.create(ipName, metadata, description));
                publicIps++;
            }
            // network
            const deploymentFactory = new DeploymentFactory(this.twin_id, this.url, this.mnemonic);
            const accessNodes = yield getAccessNodes();
            let access_net_workload;
            let wgConfig = "";
            let hasAccessNode = false;
            for (const accessNode of Object.keys(accessNodes)) {
                if (network.nodeExists(Number(accessNode))) {
                    hasAccessNode = true;
                    break;
                }
            }
            if (!Object.keys(accessNodes).includes(nodeId.toString()) && !hasAccessNode) {
                // add node to any access node and deploy it
                const filteredAccessNodes = [];
                for (const accessNodeId of Object.keys(accessNodes)) {
                    if (accessNodes[accessNodeId]["ipv4"]) {
                        filteredAccessNodes.push(accessNodeId);
                    }
                }
                const access_node_id = Number(randomChoice(filteredAccessNodes));
                access_net_workload = yield network.addNode(access_node_id, metadata, description);
                wgConfig = yield network.addAccess(access_node_id, true);
            }
            const znet_workload = yield network.addNode(nodeId, metadata, description);
            if (znet_workload && network.exists()) {
                // update network
                for (const deployment of network.deployments) {
                    const d = deploymentFactory.fromObj(deployment);
                    for (const workload of d["workloads"]) {
                        if (workload["type"] !== WorkloadTypes.network ||
                            !Addr(network.ipRange).contains(Addr(workload["data"]["subnet"]))) {
                            continue;
                        }
                        workload.data = network.updateNetwork(workload["data"]);
                        workload.version += 1;
                        break;
                    }
                    deployments.push(new TwinDeployment(d, Operations.update, 0, 0, network));
                }
                workloads.push(znet_workload);
            }
            else if (znet_workload) {
                // node not exist on the network
                if (!access_net_workload && !hasAccessNode) {
                    // this node is access node, so add access point on it
                    wgConfig = yield network.addAccess(nodeId, true);
                    znet_workload["data"] = network.updateNetwork(znet_workload.data);
                }
                workloads.push(znet_workload);
            }
            if (access_net_workload) {
                // network is not exist, and the node provide is not an access node
                const accessNodeId = access_net_workload.data["node_id"];
                access_net_workload["data"] = network.updateNetwork(access_net_workload.data);
                const deployment = deploymentFactory.create([access_net_workload], 1626394539, metadata, description);
                deployments.push(new TwinDeployment(deployment, Operations.deploy, 0, accessNodeId, network));
            }
            // vm
            // check the planetary
            const vm = new VM();
            const machine_ip = network.getFreeIP(nodeId);
            console.log(`Creating a vm on node: ${nodeId}, network: ${network.name} with private ip: ${machine_ip}`);
            workloads.push(vm.create(name, flist, cpu, memory, diskMounts, network.name, machine_ip, true, ipName, entrypoint, env, metadata, description));
            // deployment
            // NOTE: expiration is not used for zos deployment
            const deployment = deploymentFactory.create(workloads, 1626394539, metadata, description);
            deployments.push(new TwinDeployment(deployment, Operations.deploy, publicIps, nodeId, network));
            return [deployments, wgConfig];
        });
    }
    update(oldDeployment, name, nodeId, flist, cpu, memory, disks, publicIp, network, entrypoint, env, metadata = "", description = "") {
        return __awaiter(this, void 0, void 0, function* () {
            const [twinDeployments, _] = yield this.create(name, nodeId, flist, cpu, memory, disks, publicIp, network, entrypoint, env, metadata, description);
            const deploymentFactory = new DeploymentFactory(this.twin_id, this.url, this.mnemonic);
            const updatedDeployment = yield deploymentFactory.UpdateDeployment(oldDeployment, twinDeployments.pop().deployment, network);
            if (!updatedDeployment) {
                throw Error("Nothing found to be updated");
            }
            return new TwinDeployment(updatedDeployment, Operations.update, 0, 0, network);
        });
    }
    delete(deployment, names) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._delete(deployment, names, [
                WorkloadTypes.ipv4,
                WorkloadTypes.zmount,
                WorkloadTypes.zmachine,
            ]);
        });
    }
}
export { VirtualMachine };
