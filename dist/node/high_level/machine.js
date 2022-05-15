"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VMHL = void 0;
const netaddr_1 = require("netaddr");
const events_1 = require("../helpers/events");
const utils_1 = require("../helpers/utils");
const qsfs_zdbs_1 = require("../modules/qsfs_zdbs");
const index_1 = require("../primitives/index");
const qsfs_1 = require("../primitives/qsfs");
const zos_1 = require("../zos");
const workload_1 = require("../zos/workload");
const base_1 = require("./base");
const models_1 = require("./models");
class VMHL extends base_1.HighLevelBase {
    async create(name, nodeId, flist, cpu, memory, rootfs_size, disks, publicIp, publicIp6, planetary, network, entrypoint, env, metadata = "", description = "", qsfsDisks = [], qsfsProjectName = "", addAccess = false, ip = "", corex = false) {
        const deployments = [];
        const workloads = [];
        let totalDisksSize = rootfs_size;
        const nodes = new index_1.Nodes(this.config.graphqlURL, this.config.rmbClient["proxyURL"]);
        // disks
        const diskMounts = [];
        const disk = new index_1.DiskPrimitive();
        for (const d of disks) {
            totalDisksSize += d.size;
            workloads.push(disk.create(d.size, d.name, metadata, description));
            diskMounts.push(disk.createMount(d.name, d.mountpoint));
        }
        if (!(await nodes.nodeHasResources(nodeId, { sru: totalDisksSize, mru: memory / 1024 }))) {
            throw Error(`Node ${nodeId} doesn't have enough resources: sru=${totalDisksSize}, mru=${memory / 1024}`);
        }
        const twinId = this.config.twinId;
        if (!(await nodes.nodeAvailableForTwinId(nodeId, twinId))) {
            throw Error(`Node ${nodeId} is not available for user with twinId: ${twinId}, maybe it's rented by another user or node is dedicated. use capacity planning with availableFor option.`);
        }
        // qsfs disks
        const qsfsPrimitive = new qsfs_1.QSFSPrimitive();
        for (const d of qsfsDisks) {
            // the ratio that will be used for minimal_shards to expected_shards is 3/5
            const qsfsZdbsModule = new qsfs_zdbs_1.qsfs_zdbs(this.config);
            if (qsfsProjectName) {
                qsfsZdbsModule.config.projectName = qsfsProjectName;
            }
            const qsfsZdbs = await qsfsZdbsModule.getZdbs(d.qsfs_zdbs_name);
            if (qsfsZdbs.groups.length === 0 || qsfsZdbs.meta.length === 0) {
                throw Error(`Couldn't find a qsfs zdbs with name ${d.qsfs_zdbs_name}. Please create one with qsfs_zdbs module`);
            }
            let minimalShards = Math.ceil((qsfsZdbs.groups.length * 3) / 5);
            let expectedShards = qsfsZdbs.groups.length;
            if (d.minimal_shards) {
                minimalShards = d.minimal_shards;
                if (minimalShards >= qsfsZdbs.groups.length) {
                    throw Error("Minimal shards can't be more than the number of zdbs in qsfs_zdbs deployment");
                }
            }
            if (d.expected_shards) {
                expectedShards = d.expected_shards;
                if (expectedShards > qsfsZdbs.groups.length) {
                    throw Error("Expected shards can't be more than the number of zdbs in qsfs_zdbs deployment");
                }
            }
            const groups = new zos_1.ZdbGroup();
            groups.backends = qsfsZdbs.groups;
            const qsfsWorkload = qsfsPrimitive.create(d.name, minimalShards, expectedShards, d.prefix, qsfsZdbs.meta, [groups], d.encryption_key, d.cache, 32, "zdb", 0, 0, "AES", "snappy", JSON.stringify({ qsfs_zdbs_name: d.qsfs_zdbs_name }));
            workloads.push(qsfsWorkload);
            diskMounts.push(disk.createMount(d.name, d.mountpoint));
        }
        // ipv4
        let ipName = "";
        let publicIps = 0;
        if (publicIp || publicIp6) {
            const ip = new index_1.PublicIPPrimitive();
            ipName = `${name}_pubip`;
            workloads.push(ip.create(ipName, metadata, description, 0, publicIp, publicIp6));
            if (publicIp) {
                publicIps++;
            }
        }
        // validate user ip subnet in case of no networks already
        let userIPsubnet;
        let accessNodeSubnet;
        if (ip) {
            userIPsubnet = network.ValidateFreeSubnet((0, netaddr_1.Addr)(ip).mask(24).toString());
            accessNodeSubnet = network.getFreeSubnet();
        }
        // network
        const deploymentFactory = new index_1.DeploymentFactory(this.config);
        let access_net_workload;
        let wgConfig = "";
        let hasAccessNode = false;
        let accessNodes = {};
        if (addAccess) {
            accessNodes = await nodes.getAccessNodes();
            for (const accessNode of Object.keys(accessNodes)) {
                if (network.nodeExists(Number(accessNode))) {
                    hasAccessNode = true;
                    break;
                }
            }
        }
        if (!Object.keys(accessNodes).includes(nodeId.toString()) && !hasAccessNode && addAccess) {
            // add node to any access node and deploy it
            const filteredAccessNodes = [];
            for (const accessNodeId of Object.keys(accessNodes)) {
                if (accessNodes[accessNodeId]["ipv4"]) {
                    filteredAccessNodes.push(accessNodeId);
                }
            }
            const access_node_id = Number((0, utils_1.randomChoice)(filteredAccessNodes));
            access_net_workload = await network.addNode(access_node_id, metadata, description, accessNodeSubnet);
            wgConfig = await network.addAccess(access_node_id, true);
        }
        const znet_workload = await network.addNode(nodeId, metadata, description, userIPsubnet);
        if ((await network.exists()) && (znet_workload || access_net_workload)) {
            // update network
            for (const deployment of network.deployments) {
                const d = await deploymentFactory.fromObj(deployment);
                for (const workload of d["workloads"]) {
                    if (workload["type"] !== workload_1.WorkloadTypes.network ||
                        !(0, netaddr_1.Addr)(network.ipRange).contains((0, netaddr_1.Addr)(workload["data"]["subnet"]))) {
                        continue;
                    }
                    workload.data = network.updateNetwork(workload["data"]);
                    workload.version += 1;
                    break;
                }
                deployments.push(new models_1.TwinDeployment(d, models_1.Operations.update, 0, 0, network));
            }
            if (znet_workload)
                workloads.push(znet_workload);
        }
        else if (znet_workload) {
            // node not exist on the network
            if (!access_net_workload && !hasAccessNode && addAccess) {
                // this node is access node, so add access point on it
                wgConfig = await network.addAccess(nodeId, true);
                znet_workload["data"] = network.updateNetwork(znet_workload.data);
            }
            workloads.push(znet_workload);
        }
        if (access_net_workload) {
            // network is not exist, and the node provide is not an access node
            const accessNodeId = access_net_workload.data["node_id"];
            access_net_workload["data"] = network.updateNetwork(access_net_workload.data);
            const deployment = deploymentFactory.create([access_net_workload], 1626394539, metadata, description);
            deployments.push(new models_1.TwinDeployment(deployment, models_1.Operations.deploy, 0, accessNodeId, network));
        }
        // vm
        const vm = new index_1.VMPrimitive();
        let machine_ip;
        if (ip !== "") {
            machine_ip = network.validateUserIP(nodeId, ip);
        }
        else {
            machine_ip = network.getFreeIP(nodeId);
        }
        events_1.events.emit("logs", `Creating a vm on node: ${nodeId}, network: ${network.name} with private ip: ${machine_ip}`);
        workloads.push(vm.create(name, flist, cpu, memory, rootfs_size, diskMounts, network.name, machine_ip, planetary, ipName, entrypoint, env, metadata, description, 0, corex));
        // deployment
        // NOTE: expiration is not used for zos deployment
        const deployment = deploymentFactory.create(workloads, 0, metadata, description);
        deployments.push(new models_1.TwinDeployment(deployment, models_1.Operations.deploy, publicIps, nodeId, network));
        return [deployments, wgConfig];
    }
    async delete(deployment, names) {
        return await this._delete(deployment, names, [
            workload_1.WorkloadTypes.ip,
            workload_1.WorkloadTypes.ipv4,
            workload_1.WorkloadTypes.zmount,
            workload_1.WorkloadTypes.zmachine,
            workload_1.WorkloadTypes.qsfs,
        ]);
    }
}
exports.VMHL = VMHL;
