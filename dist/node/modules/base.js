"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseModule = void 0;
const PATH = __importStar(require("path"));
const workload_1 = require("../zos/workload");
const base_1 = require("../high_level/base");
const twinDeploymentHandler_1 = require("../high_level/twinDeploymentHandler");
const models_1 = require("../high_level/models");
const jsonfs_1 = require("../helpers/jsonfs");
const nodes_1 = require("../primitives/nodes");
const deployment_1 = require("../primitives/deployment");
const client_1 = require("../tf-grid/client");
class BaseModule {
    twin_id;
    url;
    mnemonic;
    rmbClient;
    storePath;
    projectName = "";
    fileName = "";
    workloadTypes = [];
    deploymentFactory;
    twinDeploymentHandler;
    constructor(twin_id, url, mnemonic, rmbClient, storePath, projectName = "") {
        this.twin_id = twin_id;
        this.url = url;
        this.mnemonic = mnemonic;
        this.rmbClient = rmbClient;
        this.storePath = storePath;
        this.deploymentFactory = new deployment_1.DeploymentFactory(twin_id, url, mnemonic);
        this.twinDeploymentHandler = new twinDeploymentHandler_1.TwinDeploymentHandler(this.rmbClient, twin_id, url, mnemonic);
        this.projectName = projectName;
    }
    _load() {
        const path = PATH.join(this.storePath, this.projectName, this.fileName);
        return [path, (0, jsonfs_1.loadFromFile)(path)];
    }
    save(name, contracts, wgConfig = "") {
        const [path, data] = this._load();
        let deploymentData = { contracts: [], wireguard_config: "" };
        if (Object.keys(data).includes(name)) {
            deploymentData = data[name];
        }
        for (const contract of contracts["created"]) {
            deploymentData.contracts.push({
                contract_id: contract["contract_id"],
                node_id: contract["contract_type"]["nodeContract"]["node_id"],
            });
        }
        for (const contract of contracts["deleted"]) {
            deploymentData.contracts = deploymentData.contracts.filter(c => c["contract_id"] !== contract["contract_id"]);
        }
        if (wgConfig) {
            deploymentData["wireguard_config"] = wgConfig;
        }
        if (deploymentData.contracts.length !== 0) {
            (0, jsonfs_1.updatejson)(path, name, deploymentData);
        }
        else {
            (0, jsonfs_1.updatejson)(path, name, deploymentData, "delete");
        }
        return deploymentData;
    }
    _list() {
        const [_, data] = this._load();
        return Object.keys(data);
    }
    exists(name) {
        return this._list().includes(name);
    }
    _getDeploymentNodeIds(name) {
        const nodeIds = [];
        const contracts = this._getContracts(name);
        for (const contract of contracts) {
            nodeIds.push(contract["node_id"]);
        }
        return nodeIds;
    }
    _getContracts(name) {
        const [_, data] = this._load();
        if (!Object.keys(data).includes(name)) {
            return [];
        }
        return data[name]["contracts"];
    }
    _getContractIdFromNodeId(name, nodeId) {
        const contracts = this._getContracts(name);
        for (const contract of contracts) {
            if (contract["node_id"] === nodeId) {
                return contract["contract_id"];
            }
        }
    }
    _getNodeIdFromContractId(name, contractId) {
        const contracts = this._getContracts(name);
        for (const contract of contracts) {
            if (contract["contract_id"] === contractId) {
                return contract["node_id"];
            }
        }
    }
    _getWorkloadsByType(deployments, type) {
        const r = [];
        for (const deployment of deployments) {
            for (const workload of deployment.workloads) {
                if (workload.type === type) {
                    r.push(workload);
                }
            }
        }
        return r;
    }
    _getMachinePubIP(deployments, ipv4WorkloadName) {
        const ipv4Workloads = this._getWorkloadsByType(deployments, workload_1.WorkloadTypes.ipv4);
        for (const workload of ipv4Workloads) {
            if (workload.name === ipv4WorkloadName) {
                return workload.result.data;
            }
        }
        return null;
    }
    _getZmachineData(deployments, workload) {
        const data = workload.data;
        return {
            version: workload.version,
            name: workload.name,
            created: workload.result.created,
            status: workload.result.state,
            message: workload.result.message,
            flist: data.flist,
            publicIP: this._getMachinePubIP(deployments, data.network.public_ip),
            planetary: data.network.planetary,
            yggIP: data.network.planetary ? workload.result.data.ygg_ip : "",
            interfaces: data.network.interfaces.map(n => ({
                network: n.network,
                ip: n.ip,
            })),
            capacity: {
                cpu: data.compute_capacity.cpu,
                memory: data.compute_capacity.memory / (1024 * 1024), // MB
            },
            mounts: data.mounts.map(m => ({
                name: m.name,
                mountPoint: m.mountpoint,
                ...this._getDiskData(deployments, m.name),
            })),
            env: data.env,
            entrypoint: data.entrypoint,
            metadata: workload.metadata,
            description: workload.description,
        };
    }
    _getDiskData(deployments, name) {
        for (const deployment of deployments) {
            for (const workload of deployment.workloads) {
                if (workload.type === workload_1.WorkloadTypes.zmount && workload.name === name) {
                    return { size: workload.data.size, state: workload.result.state, message: workload.result.message };
                }
                else if (workload.type === workload_1.WorkloadTypes.qsfs && workload.name === name) {
                    const metadata = JSON.parse(workload.metadata);
                    return {
                        cache: workload.data.cache,
                        prefix: workload.data.config.meta.config.prefix,
                        minimal_shards: workload.data.config.minimal_shards,
                        expected_shards: workload.data.config.expected_shards,
                        qsfs_zdbs_name: metadata.qsfs_zdbs_name,
                        state: workload.result.state,
                        message: workload.result.message,
                    };
                }
            }
        }
    }
    async _get(name) {
        const [_, data] = this._load();
        if (!Object.keys(data).includes(name)) {
            return [];
        }
        const deployments = [];
        for (const contract of data[name]["contracts"]) {
            const tfClient = new client_1.TFClient(this.url, this.mnemonic);
            try {
                await tfClient.connect();
                const c = await tfClient.contracts.get(contract["contract_id"]);
                if (c.state !== "Created") {
                    this.save(name, { created: [], deleted: [{ contract_id: contract["contract_id"] }] });
                    continue;
                }
            }
            finally {
                tfClient.disconnect();
            }
            const nodes = new nodes_1.Nodes(this.url);
            const node_twin_id = await nodes.getNodeTwinId(contract["node_id"]);
            const payload = JSON.stringify({ contract_id: contract["contract_id"] });
            const msg = this.rmbClient.prepare("zos.deployment.get", [node_twin_id], 0, 2);
            const messgae = await this.rmbClient.send(msg, payload);
            const result = await this.rmbClient.read(messgae);
            if (result[0].err) {
                throw Error(String(result[0].err));
            }
            const deployment = JSON.parse(String(result[0].dat));
            let found = false;
            for (const workload of deployment.workloads) {
                if (this.workloadTypes.includes(workload.type) && workload.result.state !== "deleted") {
                    found = true;
                    break;
                }
            }
            if (found) {
                deployments.push(deployment);
            }
            else {
                this.save(name, { created: [], deleted: [{ contract_id: contract["contract_id"] }] });
            }
        }
        return deployments;
    }
    async _update(module, name, oldDeployments, twinDeployments, network = null) {
        let finalTwinDeployments = [];
        finalTwinDeployments = twinDeployments.filter(d => d.operation === models_1.Operations.update);
        twinDeployments = this.twinDeploymentHandler.deployMerge(twinDeployments);
        const deploymentNodeIds = this._getDeploymentNodeIds(name);
        finalTwinDeployments = finalTwinDeployments.concat(twinDeployments.filter(d => !deploymentNodeIds.includes(d.nodeId)));
        for (let oldDeployment of oldDeployments) {
            oldDeployment = await this.deploymentFactory.fromObj(oldDeployment);
            const node_id = this._getNodeIdFromContractId(name, oldDeployment.contract_id);
            let deploymentFound = false;
            for (const twinDeployment of twinDeployments) {
                if (twinDeployment.nodeId !== node_id) {
                    continue;
                }
                oldDeployment = await this.deploymentFactory.UpdateDeployment(oldDeployment, twinDeployment.deployment, network);
                deploymentFound = true;
                if (!oldDeployment) {
                    continue;
                }
                finalTwinDeployments.push(new models_1.TwinDeployment(oldDeployment, models_1.Operations.update, 0, 0, network));
                break;
            }
            if (!deploymentFound) {
                const tDeployments = await module.delete(oldDeployment, []);
                finalTwinDeployments = finalTwinDeployments.concat(tDeployments);
            }
        }
        const contracts = await this.twinDeploymentHandler.handle(finalTwinDeployments);
        if (contracts.created.length === 0 && contracts.updated.length === 0 && contracts.deleted.length === 0) {
            return "Nothing found to update";
        }
        this.save(name, contracts);
        return { contracts: contracts };
    }
    async _add(deployment_name, node_id, oldDeployments, twinDeployments, network = null) {
        const finalTwinDeployments = twinDeployments.filter(d => d.operation === models_1.Operations.update);
        const twinDeployment = twinDeployments.pop();
        const contract_id = this._getContractIdFromNodeId(deployment_name, node_id);
        if (contract_id) {
            for (let oldDeployment of oldDeployments) {
                oldDeployment = await this.deploymentFactory.fromObj(oldDeployment);
                if (oldDeployment.contract_id !== contract_id) {
                    continue;
                }
                const newDeployment = await this.deploymentFactory.fromObj(oldDeployment);
                newDeployment.workloads = newDeployment.workloads.concat(twinDeployment.deployment.workloads);
                const deployment = await this.deploymentFactory.UpdateDeployment(oldDeployment, newDeployment, network);
                twinDeployment.deployment = deployment;
                twinDeployment.operation = models_1.Operations.update;
                break;
            }
        }
        finalTwinDeployments.push(twinDeployment);
        const contracts = await this.twinDeploymentHandler.handle(finalTwinDeployments);
        this.save(deployment_name, contracts);
        return { contracts: contracts };
    }
    async _deleteInstance(module, deployment_name, name) {
        const deployments = await this._get(deployment_name);
        for (const deployment of deployments) {
            const twinDeployments = await module.delete(deployment, [name]);
            const contracts = await this.twinDeploymentHandler.handle(twinDeployments);
            if (contracts["deleted"].length > 0 || contracts["updated"].length > 0) {
                this.save(deployment_name, contracts, "");
                this._get(deployment_name);
                return contracts;
            }
        }
        throw Error(`instance with name ${name} is not found`);
    }
    async _delete(name) {
        const [path, data] = this._load();
        const contracts = { deleted: [], updated: [] };
        if (!Object.keys(data).includes(name)) {
            return contracts;
        }
        const deployments = await this._get(name);
        const highlvl = new base_1.HighLevelBase(this.twin_id, this.url, this.mnemonic, this.rmbClient, this.storePath);
        for (const deployment of deployments) {
            const twinDeployments = await highlvl._delete(deployment, []);
            const contract = await this.twinDeploymentHandler.handle(twinDeployments);
            contracts.deleted = contracts.deleted.concat(contract["deleted"]);
            contracts.updated = contracts.updated.concat(contract["updated"]);
        }
        const deletedContracts = [];
        for (const c of contracts.deleted) {
            deletedContracts.push(c["contract_id"]);
        }
        const updatedContracts = [];
        for (const c of contracts.updated) {
            if (!deletedContracts.includes(c["contract_id"])) {
                updatedContracts.push(c);
            }
        }
        contracts.updated = updatedContracts;
        (0, jsonfs_1.updatejson)(path, name, "", "delete");
        return contracts;
    }
}
exports.BaseModule = BaseModule;
