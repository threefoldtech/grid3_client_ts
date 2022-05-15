var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as PATH from "path";
import { RMB } from "../clients";
import { TFClient } from "../clients/tf-grid/client";
import { HighLevelBase } from "../high_level/base";
import { Operations, TwinDeployment } from "../high_level/models";
import { TwinDeploymentHandler } from "../high_level/twinDeploymentHandler";
import { DeploymentFactory } from "../primitives/deployment";
import { Nodes } from "../primitives/nodes";
import { BackendStorage } from "../storage/backend";
import { WorkloadTypes } from "../zos/workload";
class BaseModule {
    constructor(config) {
        this.config = config;
        this.moduleName = "";
        this.projectName = "";
        this.workloadTypes = [];
        this.projectName = config.projectName;
        this.rmb = new RMB(config.rmbClient);
        this.deploymentFactory = new DeploymentFactory(config);
        this.twinDeploymentHandler = new TwinDeploymentHandler(config);
        this.backendStorage = new BackendStorage(config.backendStorageType, config.substrateURL, config.mnemonic, config.storeSecret, config.keypairType);
    }
    getDeploymentPath(name) {
        return PATH.join(this.config.storePath, this.projectName, this.moduleName, name);
    }
    getDeploymentContracts(name) {
        return __awaiter(this, void 0, void 0, function* () {
            const path = PATH.join(this.getDeploymentPath(name), "contracts.json");
            const contracts = yield this.backendStorage.load(path);
            if (!contracts) {
                return [];
            }
            return contracts;
        });
    }
    save(name, contracts, wgConfig = "") {
        return __awaiter(this, void 0, void 0, function* () {
            const contractsPath = PATH.join(this.getDeploymentPath(name), "contracts.json");
            const wireguardPath = PATH.join(this.getDeploymentPath(name), `${name}.conf`);
            const oldContracts = yield this.getDeploymentContracts(name);
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
                yield this.backendStorage.dump(contractsPath, StoreContracts);
            }
            else {
                yield this.backendStorage.dump(contractsPath, "");
                yield this.backendStorage.dump(wireguardPath, "");
            }
        });
    }
    _list() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.backendStorage.list(this.getDeploymentPath(""));
        });
    }
    exists(name) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this._list()).includes(name);
        });
    }
    _getDeploymentNodeIds(name) {
        return __awaiter(this, void 0, void 0, function* () {
            const nodeIds = [];
            const contracts = yield this.getDeploymentContracts(name);
            for (const contract of contracts) {
                nodeIds.push(contract["node_id"]);
            }
            return nodeIds;
        });
    }
    _getContractIdFromNodeId(name, nodeId) {
        return __awaiter(this, void 0, void 0, function* () {
            const contracts = yield this.getDeploymentContracts(name);
            for (const contract of contracts) {
                if (contract["node_id"] === nodeId) {
                    return contract["contract_id"];
                }
            }
        });
    }
    _getNodeIdFromContractId(name, contractId) {
        return __awaiter(this, void 0, void 0, function* () {
            const contracts = yield this.getDeploymentContracts(name);
            for (const contract of contracts) {
                if (contract["contract_id"] === contractId) {
                    return contract["node_id"];
                }
            }
        });
    }
    _getWorkloadsByTypes(deploymentName, deployments, types) {
        return __awaiter(this, void 0, void 0, function* () {
            const r = [];
            for (const deployment of deployments) {
                for (const workload of deployment.workloads) {
                    if (types.includes(workload.type)) {
                        workload["contractId"] = deployment.contract_id;
                        workload["nodeId"] = yield this._getNodeIdFromContractId(deploymentName, deployment.contract_id);
                        r.push(workload);
                    }
                }
            }
            return r;
        });
    }
    _getMachinePubIP(deploymentName, deployments, publicIPWorkloadName) {
        return __awaiter(this, void 0, void 0, function* () {
            const publicIPWorkloads = yield this._getWorkloadsByTypes(deploymentName, deployments, [
                WorkloadTypes.ip,
                WorkloadTypes.ipv4,
            ]);
            for (const workload of publicIPWorkloads) {
                if (workload.name === publicIPWorkloadName) {
                    return workload.result.data;
                }
            }
            return null;
        });
    }
    _getZmachineData(deploymentName, deployments, workload) {
        return __awaiter(this, void 0, void 0, function* () {
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
                publicIP: yield this._getMachinePubIP(deploymentName, deployments, data.network.public_ip),
                planetary: data.network.planetary ? workload.result.data.ygg_ip : "",
                interfaces: data.network.interfaces.map(n => ({
                    network: n.network,
                    ip: n.ip,
                })),
                capacity: {
                    cpu: data.compute_capacity.cpu,
                    memory: data.compute_capacity.memory / Math.pow(1024, 2), // MB
                },
                mounts: data.mounts.map(m => (Object.assign({ name: m.name, mountPoint: m.mountpoint }, this._getDiskData(deployments, m.name)))),
                env: data.env,
                entrypoint: data.entrypoint,
                metadata: workload.metadata,
                description: workload.description,
                corex: data.corex,
            };
        });
    }
    _getDiskData(deployments, name) {
        for (const deployment of deployments) {
            for (const workload of deployment.workloads) {
                if (workload.type === WorkloadTypes.zmount && workload.name === name) {
                    return { size: workload.data.size, state: workload.result.state, message: workload.result.message };
                }
                else if (workload.type === WorkloadTypes.qsfs && workload.name === name) {
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
    _get(name) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(yield this._list()).includes(name)) {
                return [];
            }
            const deployments = [];
            const contracts = yield this.getDeploymentContracts(name);
            if (contracts.length === 0) {
                yield this.save(name, { created: [], deleted: [] });
            }
            for (const contract of contracts) {
                const tfClient = new TFClient(this.config.substrateURL, this.config.mnemonic, this.config.storeSecret, this.config.keypairType);
                const c = yield tfClient.contracts.get(contract["contract_id"]);
                if (Object.keys(c.state).includes("deleted")) {
                    yield this.save(name, { created: [], deleted: [{ contract_id: contract["contract_id"] }] });
                    continue;
                }
                const nodes = new Nodes(this.config.graphqlURL, this.config.rmbClient["proxyURL"]);
                const node_twin_id = yield nodes.getNodeTwinId(contract["node_id"]);
                const payload = JSON.stringify({ contract_id: contract["contract_id"] });
                let deployment;
                try {
                    deployment = yield this.rmb.request([node_twin_id], "zos.deployment.get", payload);
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
                    yield this.save(name, { created: [], deleted: [{ contract_id: contract["contract_id"] }] });
                }
            }
            return deployments;
        });
    }
    _update(module, name, oldDeployments, twinDeployments, network = null) {
        return __awaiter(this, void 0, void 0, function* () {
            let finalTwinDeployments = [];
            finalTwinDeployments = twinDeployments.filter(d => d.operation === Operations.update);
            twinDeployments = this.twinDeploymentHandler.deployMerge(twinDeployments);
            const deploymentNodeIds = yield this._getDeploymentNodeIds(name);
            finalTwinDeployments = finalTwinDeployments.concat(twinDeployments.filter(d => !deploymentNodeIds.includes(d.nodeId)));
            for (let oldDeployment of oldDeployments) {
                oldDeployment = yield this.deploymentFactory.fromObj(oldDeployment);
                const node_id = yield this._getNodeIdFromContractId(name, oldDeployment.contract_id);
                let deploymentFound = false;
                for (const twinDeployment of twinDeployments) {
                    if (twinDeployment.nodeId !== node_id) {
                        continue;
                    }
                    oldDeployment = yield this.deploymentFactory.UpdateDeployment(oldDeployment, twinDeployment.deployment, network);
                    deploymentFound = true;
                    if (!oldDeployment) {
                        continue;
                    }
                    finalTwinDeployments.push(new TwinDeployment(oldDeployment, Operations.update, 0, 0, network));
                    break;
                }
                if (!deploymentFound) {
                    const tDeployments = yield module.delete(oldDeployment, []);
                    finalTwinDeployments = finalTwinDeployments.concat(tDeployments);
                }
            }
            const contracts = yield this.twinDeploymentHandler.handle(finalTwinDeployments);
            if (contracts.created.length === 0 && contracts.updated.length === 0 && contracts.deleted.length === 0) {
                return "Nothing found to update";
            }
            yield this.save(name, contracts);
            return { contracts: contracts };
        });
    }
    _add(deployment_name, node_id, oldDeployments, twinDeployments, network = null) {
        return __awaiter(this, void 0, void 0, function* () {
            const finalTwinDeployments = twinDeployments.filter(d => d.operation === Operations.update);
            const twinDeployment = twinDeployments.pop();
            const contract_id = yield this._getContractIdFromNodeId(deployment_name, node_id);
            if (contract_id) {
                for (let oldDeployment of oldDeployments) {
                    oldDeployment = yield this.deploymentFactory.fromObj(oldDeployment);
                    if (oldDeployment.contract_id !== contract_id) {
                        continue;
                    }
                    const newDeployment = yield this.deploymentFactory.fromObj(oldDeployment);
                    newDeployment.workloads = newDeployment.workloads.concat(twinDeployment.deployment.workloads);
                    const deployment = yield this.deploymentFactory.UpdateDeployment(oldDeployment, newDeployment, network);
                    twinDeployment.deployment = deployment;
                    twinDeployment.operation = Operations.update;
                    break;
                }
            }
            finalTwinDeployments.push(twinDeployment);
            const contracts = yield this.twinDeploymentHandler.handle(finalTwinDeployments);
            yield this.save(deployment_name, contracts);
            return { contracts: contracts };
        });
    }
    _deleteInstance(module, deployment_name, name) {
        return __awaiter(this, void 0, void 0, function* () {
            const deployments = yield this._get(deployment_name);
            for (const deployment of deployments) {
                const twinDeployments = yield module.delete(deployment, [name]);
                const contracts = yield this.twinDeploymentHandler.handle(twinDeployments);
                if (contracts["deleted"].length > 0 || contracts["updated"].length > 0) {
                    yield this.save(deployment_name, contracts, "");
                    yield this._get(deployment_name);
                    return contracts;
                }
            }
            throw Error(`Instance with name ${name} is not found`);
        });
    }
    _delete(name) {
        return __awaiter(this, void 0, void 0, function* () {
            const contracts = { created: [], deleted: [], updated: [] };
            if (!(yield this._list()).includes(name)) {
                return contracts;
            }
            const deployments = yield this._get(name);
            const highlvl = new HighLevelBase(this.config);
            for (const deployment of deployments) {
                const twinDeployments = yield highlvl._delete(deployment, []);
                const contract = yield this.twinDeploymentHandler.handle(twinDeployments);
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
            yield this.save(name, contracts);
            return contracts;
        });
    }
}
export { BaseModule };
