"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeploymentFactory = void 0;
const deployment_1 = require("../zos/deployment");
const workload_1 = require("../zos/workload");
const zdb_1 = require("../zos/zdb");
const workload_2 = require("../zos/workload");
const gateway_1 = require("../zos/gateway");
const zmachine_1 = require("../zos/zmachine");
const zmount_1 = require("../zos/zmount");
const znet_1 = require("../zos/znet");
const ipv4_1 = require("../zos/ipv4");
const computecapacity_1 = require("../zos/computecapacity");
const nodes_1 = require("./nodes");
const qsfs_1 = require("../zos/qsfs");
class DeploymentFactory {
    twin_id;
    url;
    mnemonic;
    constructor(twin_id, url, mnemonic) {
        this.twin_id = twin_id;
        this.url = url;
        this.mnemonic = mnemonic;
    }
    create(workloads, expiration, metadata = "", description = "", version = 0) {
        const signature_request = new deployment_1.SignatureRequest();
        signature_request.twin_id = this.twin_id;
        signature_request.weight = 1;
        const signature_requirement = new deployment_1.SignatureRequirement();
        signature_requirement.weight_required = 1;
        signature_requirement.requests = [signature_request];
        const deployment = new deployment_1.Deployment();
        deployment.version = version;
        deployment.metadata = metadata;
        deployment.description = description;
        deployment.twin_id = this.twin_id;
        deployment.expiration = expiration;
        deployment.workloads = workloads;
        deployment.signature_requirement = signature_requirement;
        return deployment;
    }
    async UpdateDeployment(oldDeployment, newDeployment, network = null) {
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
            if (workload.type === workload_2.WorkloadTypes.network) {
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
                if (w.type === workload_2.WorkloadTypes.network) {
                    continue;
                }
                if (w.name !== workload.name) {
                    continue;
                }
                const oldVersion = workload.version;
                workload.version = 0;
                // Don't change the machine ip
                if (w.type === workload_2.WorkloadTypes.zmachine) {
                    const node_id = await (0, nodes_1.getNodeIdFromContractId)(oldDeployment.contract_id, this.url, this.mnemonic);
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
    fromObj(deployment) {
        const d = new deployment_1.Deployment();
        Object.assign(d, deployment);
        const signature_requirement = new deployment_1.SignatureRequirement();
        Object.assign(signature_requirement, d.signature_requirement);
        const requests = [];
        for (const request of signature_requirement.requests) {
            const r = new deployment_1.SignatureRequest();
            Object.assign(r, request);
            requests.push(r);
        }
        signature_requirement.requests = requests;
        d.signature_requirement = signature_requirement;
        const workloads = [];
        for (const workload of d.workloads) {
            const w = new workload_1.Workload();
            Object.assign(w, workload);
            if (workload.type === workload_2.WorkloadTypes.ipv4) {
                const ipv4 = new ipv4_1.PublicIP();
                Object.assign(ipv4, w.data);
                w.data = ipv4;
                workloads.push(w);
            }
            else if (workload.type === workload_2.WorkloadTypes.zdb) {
                const zdb = new zdb_1.Zdb();
                Object.assign(zdb, w.data);
                w.data = zdb;
                workloads.push(w);
            }
            else if (workload.type === workload_2.WorkloadTypes.network) {
                const znet = new znet_1.Znet();
                Object.assign(znet, w.data);
                const peers = [];
                for (const peer of znet.peers) {
                    const p = new znet_1.Peer();
                    Object.assign(p, peer);
                    peers.push(p);
                }
                znet.peers = peers;
                w.data = znet;
                workloads.push(w);
            }
            else if (workload.type === workload_2.WorkloadTypes.zmount) {
                const zmount = new zmount_1.Zmount();
                Object.assign(zmount, w.data);
                w.data = zmount;
                workloads.push(w);
            }
            else if (workload.type === workload_2.WorkloadTypes.zmachine) {
                const zmachine = new zmachine_1.Zmachine();
                Object.assign(zmachine, w.data);
                const net = new zmachine_1.ZmachineNetwork();
                Object.assign(net, zmachine.network);
                zmachine.network = net;
                const computeCapacity = new computecapacity_1.ComputeCapacity();
                Object.assign(computeCapacity, zmachine.compute_capacity);
                zmachine.compute_capacity = computeCapacity;
                const mounts = [];
                for (const mount of zmachine.mounts) {
                    const m = new zmachine_1.Mount();
                    Object.assign(m, mount);
                    mounts.push(m);
                }
                zmachine.mounts = mounts;
                w.data = zmachine;
                workloads.push(w);
            }
            else if (workload.type === workload_2.WorkloadTypes.gatewayfqdnproxy) {
                const fqdngw = new gateway_1.GatewayFQDNProxy();
                Object.assign(fqdngw, w.data);
                w.data = fqdngw;
                workloads.push(w);
            }
            else if (workload.type === workload_2.WorkloadTypes.gatewaynameproxy) {
                const namegw = new gateway_1.GatewayNameProxy();
                Object.assign(namegw, w.data);
                w.data = namegw;
                workloads.push(w);
            }
            else if (workload.type === workload_2.WorkloadTypes.qsfs) {
                const qsfs = new qsfs_1.QuantumSafeFS();
                Object.assign(qsfs, w.data);
                const quantumSafeFSConfig = new qsfs_1.QuantumSafeFSConfig();
                Object.assign(quantumSafeFSConfig, qsfs.config);
                const encryption = new qsfs_1.Encryption();
                Object.assign(encryption, quantumSafeFSConfig.encryption);
                quantumSafeFSConfig.encryption = encryption;
                const quantumSafeMeta = new qsfs_1.QuantumSafeMeta();
                Object.assign(quantumSafeMeta, quantumSafeFSConfig.meta);
                const quantumSafeConfig = new qsfs_1.QuantumSafeConfig();
                Object.assign(quantumSafeConfig, quantumSafeMeta.config);
                const metaEncryption = new qsfs_1.Encryption();
                Object.assign(metaEncryption, quantumSafeConfig.encryption);
                quantumSafeConfig.encryption = metaEncryption;
                const metaBackends = [];
                for (const backend of quantumSafeConfig.backends) {
                    const zdbBackend = new qsfs_1.ZdbBackend();
                    Object.assign(zdbBackend, backend);
                    metaBackends.push(zdbBackend);
                }
                quantumSafeConfig.backends = metaBackends;
                quantumSafeMeta.config = quantumSafeConfig;
                quantumSafeFSConfig.meta = quantumSafeMeta;
                const zdbGroups = [];
                for (const zdbGroup of quantumSafeFSConfig.groups) {
                    const group = new qsfs_1.ZdbGroup();
                    Object.assign(group, zdbGroup);
                    const zdbBackends = [];
                    for (const zdbBackend of group.backends) {
                        const backend = new qsfs_1.ZdbBackend();
                        Object.assign(backend, zdbBackend);
                        zdbBackends.push(backend);
                    }
                    group.backends = zdbBackends;
                    zdbGroups.push(group);
                }
                quantumSafeFSConfig.groups = zdbGroups;
                const quantumCompression = new qsfs_1.QuantumCompression();
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
exports.DeploymentFactory = DeploymentFactory;
