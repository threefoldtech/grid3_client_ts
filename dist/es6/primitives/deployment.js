var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
import { getNodeIdFromContractId } from "./nodes";
import { QuantumSafeFS, QuantumSafeFSConfig, Encryption, QuantumSafeMeta, QuantumSafeConfig, ZdbBackend, ZdbGroup, QuantumCompression, } from "../zos/qsfs";
class DeploymentFactory {
    constructor(twin_id, url, mnemonic) {
        this.twin_id = twin_id;
        this.url = url;
        this.mnemonic = mnemonic;
    }
    create(workloads, expiration, metadata = "", description = "", version = 0) {
        const signature_request = new SignatureRequest();
        signature_request.twin_id = this.twin_id;
        signature_request.weight = 1;
        signature_request.required = false;
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
    UpdateDeployment(oldDeployment, newDeployment, network = null) {
        return __awaiter(this, void 0, void 0, function* () {
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
                        const node_id = yield getNodeIdFromContractId(oldDeployment.contract_id, this.url, this.mnemonic);
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
        });
    }
    fromObj(deployment) {
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
            }
            else if (workload.type === WorkloadTypes.zdb) {
                const zdb = new Zdb();
                Object.assign(zdb, w.data);
                w.data = zdb;
                workloads.push(w);
            }
            else if (workload.type === WorkloadTypes.network) {
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
            }
            else if (workload.type === WorkloadTypes.zmount) {
                const zmount = new Zmount();
                Object.assign(zmount, w.data);
                w.data = zmount;
                workloads.push(w);
            }
            else if (workload.type === WorkloadTypes.zmachine) {
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
            }
            else if (workload.type === WorkloadTypes.gatewayfqdnproxy) {
                const fqdngw = new GatewayFQDNProxy();
                Object.assign(fqdngw, w.data);
                w.data = fqdngw;
                workloads.push(w);
            }
            else if (workload.type === WorkloadTypes.gatewaynameproxy) {
                const namegw = new GatewayNameProxy();
                Object.assign(namegw, w.data);
                w.data = namegw;
                workloads.push(w);
            }
            else if (workload.type === WorkloadTypes.qsfs) {
                const qsfs = new QuantumSafeFS();
                Object.assign(qsfs, w.data);
                const quantumSafeFSConfig = new QuantumSafeFSConfig();
                Object.assign(quantumSafeFSConfig, qsfs.config);
                const encryption = new Encryption();
                Object.assign(encryption, quantumSafeFSConfig.encryption);
                quantumSafeFSConfig.encryption = encryption;
                const quantumSafeMeta = new QuantumSafeMeta();
                Object.assign(quantumSafeMeta, quantumSafeFSConfig.meta);
                const quantumSafeConfig = new QuantumSafeConfig();
                Object.assign(quantumSafeConfig, quantumSafeMeta.config);
                const metaEncryption = new Encryption();
                Object.assign(metaEncryption, quantumSafeConfig.encryption);
                quantumSafeConfig.encryption = metaEncryption;
                const metaBackends = [];
                for (const backend of quantumSafeConfig.backends) {
                    const zdbBackend = new ZdbBackend();
                    Object.assign(zdbBackend, backend);
                    metaBackends.push(zdbBackend);
                }
                quantumSafeConfig.backends = metaBackends;
                quantumSafeMeta.config = quantumSafeConfig;
                quantumSafeFSConfig.meta = quantumSafeMeta;
                const zdbGroups = [];
                for (const zdbGroup of quantumSafeFSConfig.groups) {
                    const group = new ZdbGroup();
                    Object.assign(group, zdbGroup);
                    const zdbBackends = [];
                    for (const zdbBackend of group.backends) {
                        const backend = new ZdbBackend();
                        Object.assign(backend, zdbBackend);
                        zdbBackends.push(backend);
                    }
                    group.backends = zdbBackends;
                    zdbGroups.push(group);
                }
                quantumSafeFSConfig.groups = zdbGroups;
                const quantumCompression = new QuantumCompression();
                Object.assign(quantumCompression, quantumSafeFSConfig.compression);
                quantumSafeFSConfig.compression = quantumCompression;
                qsfs.config = quantumSafeFSConfig;
                w.data = qsfs;
                workloads.push(w);
            }
        }
        d.workloads = workloads;
        return d;
    }
}
export { DeploymentFactory };
