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
const clients_1 = require("../clients");
const client_1 = require("../clients/tf-grid/client");
const base_1 = require("../high_level/base");
const models_1 = require("../high_level/models");
const twinDeploymentHandler_1 = require("../high_level/twinDeploymentHandler");
const deployment_1 = require("../primitives/deployment");
const nodes_1 = require("../primitives/nodes");
const backend_1 = require("../storage/backend");
const workload_1 = require("../zos/workload");
class BaseModule {
    config;
    moduleName = "";
    projectName = "";
    workloadTypes = [];
    rmb;
    deploymentFactory;
    twinDeploymentHandler;
    backendStorage;
    constructor(config) {
        this.config = config;
        this.projectName = config.projectName;
        this.rmb = new clients_1.RMB(config.rmbClient);
        this.deploymentFactory = new deployment_1.DeploymentFactory(config);
        this.twinDeploymentHandler = new twinDeploymentHandler_1.TwinDeploymentHandler(config);
        this.backendStorage = new backend_1.BackendStorage(config.backendStorageType, config.substrateURL, config.mnemonic, config.storeSecret, config.keypairType);
    }
    getDeploymentPath(name) {
        return PATH.join(this.config.storePath, this.projectName, this.moduleName, name);
    }
    async getDeploymentContracts(name) {
        const path = PATH.join(this.getDeploymentPath(name), "contracts.json");
        const contracts = await this.backendStorage.load(path);
        if (!contracts) {
            return [];
        }
        return contracts;
    }
    async save(name, contracts, wgConfig = "") {
        const contractsPath = PATH.join(this.getDeploymentPath(name), "contracts.json");
        const wireguardPath = PATH.join(this.getDeploymentPath(name), `${name}.conf`);
        const oldContracts = await this.getDeploymentContracts(name);
        let StoreContracts = oldContracts;
        for (const contract of contracts["created"]) {
            StoreContracts.push({
                contract_id: contract["contract_id"],
                node_id: contract["contract_type"]["nodeContract"]["node_id"],
            });
            const contractPath = PATH.join(this.config.storePath, "contracts", `${contract["contract_id"]}.json`);
            const contractInfo = { projectName: this.projectName, moduleName: this.moduleName, deploymentName: name };
            this.backendStorage.dump(contractPath, contractInfo);
        }
        for (const contract of contracts["deleted"]) {
            StoreContracts = StoreContracts.filter(c => c["contract_id"] !== contract["contract_id"]);
            const contractPath = PATH.join(this.config.storePath, "contracts", `${contract["contract_id"]}.json`);
            this.backendStorage.dump(contractPath, "");
        }
        if (wgConfig) {
            this.backendStorage.dump(wireguardPath, wgConfig);
        }
        if (StoreContracts.length !== 0) {
            await this.backendStorage.dump(contractsPath, StoreContracts);
        }
        else {
            await this.backendStorage.dump(contractsPath, "");
            await this.backendStorage.dump(wireguardPath, "");
        }
    }
    async _list() {
        return await this.backendStorage.list(this.getDeploymentPath(""));
    }
    async exists(name) {
        return (await this._list()).includes(name);
    }
    async _getDeploymentNodeIds(name) {
        const nodeIds = [];
        const contracts = await this.getDeploymentContracts(name);
        for (const contract of contracts) {
            nodeIds.push(contract["node_id"]);
        }
        return nodeIds;
    }
    async _getContractIdFromNodeId(name, nodeId) {
        const contracts = await this.getDeploymentContracts(name);
        for (const contract of contracts) {
            if (contract["node_id"] === nodeId) {
                return contract["contract_id"];
            }
        }
    }
    async _getNodeIdFromContractId(name, contractId) {
        const contracts = await this.getDeploymentContracts(name);
        for (const contract of contracts) {
            if (contract["contract_id"] === contractId) {
                return contract["node_id"];
            }
        }
    }
    async _getWorkloadsByTypes(deploymentName, deployments, types) {
        const r = [];
        for (const deployment of deployments) {
            for (const workload of deployment.workloads) {
                if (types.includes(workload.type)) {
                    workload["contractId"] = deployment.contract_id;
                    workload["nodeId"] = await this._getNodeIdFromContractId(deploymentName, deployment.contract_id);
                    r.push(workload);
                }
            }
        }
        return r;
    }
    async _getMachinePubIP(deploymentName, deployments, publicIPWorkloadName) {
        const publicIPWorkloads = await this._getWorkloadsByTypes(deploymentName, deployments, [
            workload_1.WorkloadTypes.ip,
            workload_1.WorkloadTypes.ipv4,
        ]);
        for (const workload of publicIPWorkloads) {
            if (workload.name === publicIPWorkloadName) {
                return workload.result.data;
            }
        }
        return null;
    }
    async _getZmachineData(deploymentName, deployments, workload) {
        const data = workload.data;
        return {
            version: workload.version,
            contractId: workload["contractId"],
            nodeId: workload["nodeId"],
            name: workload.name,
            created: workload.result.created,
            status: workload.result.state,
            message: workload.result.message,
            flist: data.flist,
            publicIP: await this._getMachinePubIP(deploymentName, deployments, data.network.public_ip),
            planetary: data.network.planetary ? workload.result.data.ygg_ip : "",
            interfaces: data.network.interfaces.map(n => ({
                network: n.network,
                ip: n.ip,
            })),
            capacity: {
                cpu: data.compute_capacity.cpu,
                memory: data.compute_capacity.memory / 1024 ** 2, // MB
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
            corex: data.corex,
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
                        metricsEndpoint: workload.result.data.metrics_endpoint,
                    };
                }
            }
        }
    }
    async _get(name) {
        if (!(await this._list()).includes(name)) {
            return [];
        }
        const deployments = [];
        const contracts = await this.getDeploymentContracts(name);
        if (contracts.length === 0) {
            await this.save(name, { created: [], deleted: [] });
        }
        for (const contract of contracts) {
            const tfClient = new client_1.TFClient(this.config.substrateURL, this.config.mnemonic, this.config.storeSecret, this.config.keypairType);
            const c = await tfClient.contracts.get(contract["contract_id"]);
            if (Object.keys(c.state).includes("deleted")) {
                await this.save(name, { created: [], deleted: [{ contract_id: contract["contract_id"] }] });
                continue;
            }
            const nodes = new nodes_1.Nodes(this.config.graphqlURL, this.config.rmbClient["proxyURL"]);
            const node_twin_id = await nodes.getNodeTwinId(contract["node_id"]);
            const payload = JSON.stringify({ contract_id: contract["contract_id"] });
            let deployment;
            try {
                deployment = await this.rmb.request([node_twin_id], "zos.deployment.get", payload);
            }
            catch (e) {
                throw Error(`Failed to get deployment due to ${e}`);
            }
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
                await this.save(name, { created: [], deleted: [{ contract_id: contract["contract_id"] }] });
            }
        }
        return deployments;
    }
    async _update(module, name, oldDeployments, twinDeployments, network = null) {
        let finalTwinDeployments = [];
        finalTwinDeployments = twinDeployments.filter(d => d.operation === models_1.Operations.update);
        twinDeployments = this.twinDeploymentHandler.deployMerge(twinDeployments);
        const deploymentNodeIds = await this._getDeploymentNodeIds(name);
        finalTwinDeployments = finalTwinDeployments.concat(twinDeployments.filter(d => !deploymentNodeIds.includes(d.nodeId)));
        for (let oldDeployment of oldDeployments) {
            oldDeployment = await this.deploymentFactory.fromObj(oldDeployment);
            const node_id = await this._getNodeIdFromContractId(name, oldDeployment.contract_id);
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
        await this.save(name, contracts);
        return { contracts: contracts };
    }
    async _add(deployment_name, node_id, oldDeployments, twinDeployments, network = null) {
        const finalTwinDeployments = twinDeployments.filter(d => d.operation === models_1.Operations.update);
        const twinDeployment = twinDeployments.pop();
        const contract_id = await this._getContractIdFromNodeId(deployment_name, node_id);
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
        await this.save(deployment_name, contracts);
        return { contracts: contracts };
    }
    async _deleteInstance(module, deployment_name, name) {
        const deployments = await this._get(deployment_name);
        for (const deployment of deployments) {
            const twinDeployments = await module.delete(deployment, [name]);
            const contracts = await this.twinDeploymentHandler.handle(twinDeployments);
            if (contracts["deleted"].length > 0 || contracts["updated"].length > 0) {
                await this.save(deployment_name, contracts, "");
                await this._get(deployment_name);
                return contracts;
            }
        }
        throw Error(`Instance with name ${name} is not found`);
    }
    async _delete(name) {
        const contracts = { created: [], deleted: [], updated: [] };
        if (!(await this._list()).includes(name)) {
            return contracts;
        }
        const deployments = await this._get(name);
        const highlvl = new base_1.HighLevelBase(this.config);
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
        await this.save(name, contracts);
        return contracts;
    }
}
exports.BaseModule = BaseModule;
