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
const base_1 = require("../high_level/base");
const twinDeploymentHandler_1 = require("../high_level/twinDeploymentHandler");
const models_1 = require("../high_level/models");
const jsonfs_1 = require("../helpers/jsonfs");
const nodes_1 = require("../primitives/nodes");
const deployment_1 = require("../primitives/deployment");
class BaseModule {
    twin_id;
    url;
    mnemonic;
    rmbClient;
    fileName = "";
    deploymentFactory;
    twinDeploymentHandler;
    constructor(twin_id, url, mnemonic, rmbClient) {
        this.twin_id = twin_id;
        this.url = url;
        this.mnemonic = mnemonic;
        this.rmbClient = rmbClient;
        this.deploymentFactory = new deployment_1.DeploymentFactory(twin_id, url, mnemonic);
        this.twinDeploymentHandler = new twinDeploymentHandler_1.TwinDeploymentHandler(this.rmbClient, twin_id, url, mnemonic);
    }
    save(name, contracts, wgConfig = "", action = "add") {
        const path = PATH.join(jsonfs_1.appPath, this.fileName);
        const data = (0, jsonfs_1.loadFromFile)(path);
        let deploymentData = { contracts: [], wireguard_config: "" };
        if (Object.keys(data).includes(name)) {
            deploymentData = data[name];
        }
        for (const contract of contracts["created"]) {
            deploymentData.contracts.push({ contract_id: contract["contract_id"], node_id: contract["contract_type"]["nodeContract"]["node_id"] });
        }
        for (const contract of contracts["deleted"]) {
            deploymentData.contracts = deploymentData.contracts.filter(c => c["contract_id"] !== contract["contract_id"]);
        }
        if (action === "delete") {
            for (const contract of contracts["updated"]) {
                deploymentData.contracts = deploymentData.contracts.filter(c => c["contract_id"] !== contract["contract_id"]);
            }
        }
        if (wgConfig) {
            deploymentData["wireguard_config"] = wgConfig;
        }
        (0, jsonfs_1.updatejson)(path, name, deploymentData);
        return deploymentData;
    }
    _list() {
        const path = PATH.join(jsonfs_1.appPath, this.fileName);
        const data = (0, jsonfs_1.loadFromFile)(path);
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
        const path = PATH.join(jsonfs_1.appPath, this.fileName);
        const data = (0, jsonfs_1.loadFromFile)(path);
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
    async _get(name) {
        const path = PATH.join(jsonfs_1.appPath, this.fileName);
        const data = (0, jsonfs_1.loadFromFile)(path);
        if (!Object.keys(data).includes(name)) {
            return [];
        }
        const deployments = [];
        for (const contract of data[name]["contracts"]) {
            const node_twin_id = await (0, nodes_1.getNodeTwinId)(contract["node_id"]);
            const payload = JSON.stringify({ contract_id: contract["contract_id"] });
            const msg = this.rmbClient.prepare("zos.deployment.get", [node_twin_id], 0, 2);
            const messgae = await this.rmbClient.send(msg, payload);
            const result = await this.rmbClient.read(messgae);
            if (result[0].err) {
                throw Error(String(result[0].err));
            }
            deployments.push(JSON.parse(String(result[0].dat)));
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
            oldDeployment = this.deploymentFactory.fromObj(oldDeployment);
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
                oldDeployment = this.deploymentFactory.fromObj(oldDeployment);
                if (oldDeployment.contract_id !== contract_id) {
                    continue;
                }
                const newDeployment = this.deploymentFactory.fromObj(oldDeployment);
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
                this.save(deployment_name, contracts, "", "delete");
                return contracts;
            }
        }
        throw Error(`instance with name ${name} is not found`);
    }
    async _delete(name) {
        const path = PATH.join(jsonfs_1.appPath, this.fileName);
        const data = (0, jsonfs_1.loadFromFile)(path);
        const contracts = { deleted: [], updated: [] };
        if (!Object.keys(data).includes(name)) {
            return contracts;
        }
        const deployments = await this._get(name);
        const highlvl = new base_1.HighLevelBase(this.twin_id, this.url, this.mnemonic, this.rmbClient);
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