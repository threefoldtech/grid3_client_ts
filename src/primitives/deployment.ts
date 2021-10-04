import { Deployment, SignatureRequest, SignatureRequirement } from "../zos/deployment";
import { Workload } from "../zos/workload";
import { Zdb } from "../zos/zdb";
import { WorkloadTypes } from "../zos/workload";
import { GatewayFQDNProxy, GatewayNameProxy } from "../zos/gateway";
import { ZmachineNetwork, Zmachine, Mount } from "../zos/zmachine";
import { Zmount } from "../zos/zmount";
import { Znet, Peer } from "../zos/znet";
import { PublicIP } from "../zos/ipv4";
import { ComputeCapacity } from "../zos/computecapacity";
import { TFClient } from "../tf-grid/client";

import { Network } from "./network";

class DeploymentFactory {
    constructor(public twin_id: number, public url: string, public mnemonic: string) {}

    create(workloads: Workload[], expiration: number, metadata = "", description = "", version = 0): Deployment {
        const signature_request = new SignatureRequest();
        signature_request.twin_id = this.twin_id;
        signature_request.weight = 1;

        const signature_requirement = new SignatureRequirement();
        signature_requirement.weight_required = 1;
        signature_requirement.requests = [signature_request];

        const deployment = new Deployment();
        deployment.version = version;
        deployment.metadata = metadata;
        deployment.description = description;
        deployment.twin_id = this.twin_id;
        deployment.expiration = expiration;
        deployment.workloads = workloads;
        deployment.signature_requirement = signature_requirement;

        return deployment;
    }

    async UpdateDeployment(
        oldDeployment: Deployment,
        newDeployment: Deployment,
        network: Network = null,
    ): Promise<Deployment> {
        const oldWorkloadNames = [];
        const newWorkloadNames = [];
        const deletedWorkloads = [];
        const newWorkloads = [];
        let foundUpdate = false;
        const deploymentVersion = oldDeployment.version;
        for (const workload of oldDeployment.workloads) {
            oldWorkloadNames.push(workload.name);
        }
        for (const workload of newDeployment.workloads) {
            newWorkloadNames.push(workload.name);
        }

        for (const workload of oldDeployment.workloads) {
            if (workload.type === WorkloadTypes.network) {
                continue;
            }
            if (!newWorkloadNames.includes(workload.name)) {
                deletedWorkloads.push(workload);
                foundUpdate = true;
                continue;
            }
            for (const w of newDeployment.workloads) {
                if (!oldWorkloadNames.includes(w.name)) {
                    w.version = deploymentVersion + 1;
                    newWorkloads.push(w);
                    oldWorkloadNames.push(w.name);
                    foundUpdate = true;
                    continue;
                }
                if (w.type === WorkloadTypes.network) {
                    continue;
                }
                if (w.name !== workload.name) {
                    continue;
                }
                const oldVersion = workload.version;
                workload.version = 0;
                // Don't change the machine ip
                if (w.type === WorkloadTypes.zmachine) {
                    const tfclient = new TFClient(this.url, this.mnemonic);
                    await tfclient.connect();
                    const contract = await tfclient.contracts.get(oldDeployment.contract_id);
                    const node_id = contract["node_id"];
                    const oldIp = workload.data["network"]["interfaces"][0]["ip"];
                    const newIp = w.data["network"]["interfaces"][0]["ip"];
                    if (newIp !== oldIp) {
                        network.deleteReservedIp(node_id, newIp);
                        w.data["network"]["interfaces"][0]["ip"] = oldIp;
                    }
                }
                if (w.challenge() === workload.challenge()) {
                    workload.version = oldVersion;
                    continue;
                }
                workload.version = deploymentVersion + 1;
                workload.data = w.data;
                workload.description = w.description;
                workload.metadata = w.metadata;
                foundUpdate = true;
                break;
            }
        }
        // add new workloads
        oldDeployment.workloads = oldDeployment.workloads.concat(newWorkloads);

        // remove the deleted workloads
        oldDeployment.workloads = oldDeployment.workloads.filter(item => !deletedWorkloads.includes(item));

        if (!foundUpdate) {
            return null;
        }
        return oldDeployment;
    }

    fromObj(deployment): Deployment {
        const d = new Deployment();
        Object.assign(d, deployment);
        const signature_requirement = new SignatureRequirement();
        Object.assign(signature_requirement, d.signature_requirement);
        const requests = [];
        for (const request of signature_requirement.requests) {
            const r = new SignatureRequest();
            Object.assign(r, request);
            requests.push(r);
        }
        signature_requirement.requests = requests;
        d.signature_requirement = signature_requirement;
        const workloads = [];
        for (const workload of d.workloads) {
            const w = new Workload();
            Object.assign(w, workload);
            if (workload.type === WorkloadTypes.ipv4) {
                const ipv4 = new PublicIP();
                Object.assign(ipv4, w.data);
                w.data = ipv4;
                workloads.push(w);
            } else if (workload.type === WorkloadTypes.zdb) {
                const zdb = new Zdb();
                Object.assign(zdb, w.data);
                w.data = zdb;
                workloads.push(w);
            } else if (workload.type === WorkloadTypes.network) {
                const znet = new Znet();
                Object.assign(znet, w.data);
                const peers = [];
                for (const peer of znet.peers) {
                    const p = new Peer();
                    Object.assign(p, peer);
                    peers.push(p);
                }
                znet.peers = peers;
                w.data = znet;
                workloads.push(w);
            } else if (workload.type === WorkloadTypes.zmount) {
                const zmount = new Zmount();
                Object.assign(zmount, w.data);
                w.data = zmount;
                workloads.push(w);
            } else if (workload.type === WorkloadTypes.zmachine) {
                const zmachine = new Zmachine();
                Object.assign(zmachine, w.data);
                const net = new ZmachineNetwork();
                Object.assign(net, zmachine.network);
                zmachine.network = net;
                const computeCapacity = new ComputeCapacity();
                Object.assign(computeCapacity, zmachine.compute_capacity);
                zmachine.compute_capacity = computeCapacity;
                const mounts = [];
                for (const mount of zmachine.mounts) {
                    const m = new Mount();
                    Object.assign(m, mount);
                    mounts.push(m);
                }
                zmachine.mounts = mounts;
                w.data = zmachine;
                workloads.push(w);
            } else if (workload.type === WorkloadTypes.gatewayfqdnproxy) {
                const fqdngw = new GatewayFQDNProxy();
                Object.assign(fqdngw, w.data);
                w.data = fqdngw;
                workloads.push(w);
            } else if (workload.type === WorkloadTypes.gatewaynameproxy) {
                const namegw = new GatewayNameProxy();
                Object.assign(namegw, w.data);
                w.data = namegw;
                workloads.push(w);
            }
        }
        d.workloads = workloads;
        return d;
    }
}
export { DeploymentFactory };
