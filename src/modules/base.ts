import * as PATH from "path";

import { RMB } from "../clients";
import { TFClient } from "../clients/tf-grid/client";
import { GridClientConfig } from "../config";
import { HighLevelBase } from "../high_level/base";
import { KubernetesHL } from "../high_level/kubernetes";
import { VMHL } from "../high_level/machine";
import { Operations, TwinDeployment } from "../high_level/models";
import { TwinDeploymentHandler } from "../high_level/twinDeploymentHandler";
import { ZdbHL } from "../high_level/zdb";
import { DeploymentFactory } from "../primitives/deployment";
import { Network } from "../primitives/network";
import { Nodes } from "../primitives/nodes";
import { BackendStorage } from "../storage/backend";
import { Deployment } from "../zos/deployment";
import { PublicIPResult } from "../zos/public_ip";
import { Workload, WorkloadTypes } from "../zos/workload";
import { Zmachine, ZmachineResult } from "../zos/zmachine";

class BaseModule {
    moduleName = "";
    projectName = "";
    workloadTypes = [];
    rmb: RMB;
    deploymentFactory: DeploymentFactory;
    twinDeploymentHandler: TwinDeploymentHandler;
    backendStorage: BackendStorage;

    constructor(public config: GridClientConfig) {
        this.projectName = config.projectName;
        this.rmb = new RMB(config.rmbClient);
        this.deploymentFactory = new DeploymentFactory(config);
        this.twinDeploymentHandler = new TwinDeploymentHandler(config);
        this.backendStorage = new BackendStorage(
            config.backendStorageType,
            config.substrateURL,
            config.mnemonic,
            config.storeSecret,
            config.keypairType,
        );
    }

    getDeploymentPath(name: string): string {
        return PATH.join(this.config.storePath, this.projectName, this.moduleName, name);
    }

    async getDeploymentContracts(name: string) {
        const path = PATH.join(this.getDeploymentPath(name), "contracts.json");
        const contracts = await this.backendStorage.load(path);
        if (!contracts) {
            return [];
        }
        return contracts;
    }

    async save(name: string, contracts: Record<string, unknown[]>, wgConfig = "") {
        const contractsPath = PATH.join(this.getDeploymentPath(name), "contracts.json");
        const wireguardPath = PATH.join(this.getDeploymentPath(name), `${name}.conf`);
        const oldContracts = await this.getDeploymentContracts(name);
        let StoreContracts = oldContracts;

        for (const contract of contracts["created"]) {
            StoreContracts.push({
                contract_id: contract["contractId"],
                node_id: contract["contractType"]["nodeContract"]["nodeId"],
            });
            const contractPath = PATH.join(this.config.storePath, "contracts", `${contract["contractId"]}.json`);
            const contractInfo = { projectName: this.projectName, moduleName: this.moduleName, deploymentName: name };
            this.backendStorage.dump(contractPath, contractInfo);
        }
        for (const contract of contracts["deleted"]) {
            StoreContracts = StoreContracts.filter(c => c["contract_id"] !== contract["contractId"]);
            const contractPath = PATH.join(this.config.storePath, "contracts", `${contract["contractId"]}.json`);
            this.backendStorage.dump(contractPath, "");
        }
        if (wgConfig) {
            this.backendStorage.dump(wireguardPath, wgConfig);
        }
        if (StoreContracts.length !== 0) {
            await this.backendStorage.dump(contractsPath, StoreContracts);
        } else {
            await this.backendStorage.dump(contractsPath, "");
            await this.backendStorage.dump(wireguardPath, "");
        }
    }

    async _list(): Promise<string[]> {
        return await this.backendStorage.list(this.getDeploymentPath(""));
    }

    async exists(name: string): Promise<boolean> {
        return (await this._list()).includes(name);
    }

    workloadExists(name: string, oldDeployment: Deployment[]): boolean {
        for (const deployment of oldDeployment) {
            for (const workload of deployment.workloads) {
                if (name === workload.name) return true;
            }
        }
        return false;
    }

    async _getDeploymentNodeIds(name: string): Promise<number[]> {
        const nodeIds = [];
        const contracts = await this.getDeploymentContracts(name);
        for (const contract of contracts) {
            nodeIds.push(contract["node_id"]);
        }
        return nodeIds;
    }

    async _getContractIdFromNodeId(name: string, nodeId: number): Promise<number> {
        const contracts = await this.getDeploymentContracts(name);
        for (const contract of contracts) {
            if (contract["node_id"] === nodeId) {
                return contract["contract_id"];
            }
        }
    }
    async _getNodeIdFromContractId(name: string, contractId: number): Promise<number> {
        const contracts = await this.getDeploymentContracts(name);
        for (const contract of contracts) {
            if (contract["contract_id"] === contractId) {
                return contract["node_id"];
            }
        }
    }

    async _getWorkloadsByTypes(deploymentName: string, deployments, types: WorkloadTypes[]): Promise<Workload[]> {
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

    async _getMachinePubIP(deploymentName: string, deployments, publicIPWorkloadName: string): Promise<PublicIPResult> {
        const publicIPWorkloads = await this._getWorkloadsByTypes(deploymentName, deployments, [
            WorkloadTypes.ip,
            WorkloadTypes.ipv4,
        ]);
        for (const workload of publicIPWorkloads) {
            if (workload.name === publicIPWorkloadName) {
                return workload.result.data as PublicIPResult;
            }
        }
        return null;
    }

    async _getZmachineData(deploymentName: string, deployments, workload: Workload): Promise<Record<string, unknown>> {
        const data = workload.data as Zmachine;
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
            planetary: data.network.planetary ? (workload.result.data as ZmachineResult).ygg_ip : "",
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
                if (workload.type === WorkloadTypes.zmount && workload.name === name) {
                    return { size: workload.data.size, state: workload.result.state, message: workload.result.message };
                } else if (workload.type === WorkloadTypes.qsfs && workload.name === name) {
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

    async _get(name: string) {
        if (!(await this._list()).includes(name)) {
            return [];
        }
        const deployments = [];
        const contracts = await this.getDeploymentContracts(name);
        if (contracts.length === 0) {
            await this.save(name, { created: [], deleted: [] });
        }
        for (const contract of contracts) {
            const tfClient = new TFClient(
                this.config.substrateURL,
                this.config.mnemonic,
                this.config.storeSecret,
                this.config.keypairType,
            );
            const c = await tfClient.contracts.get(contract["contract_id"]);
            if (Object.keys(c.state).includes("deleted")) {
                await this.save(name, { created: [], deleted: [{ contractId: contract["contract_id"] }] });
                continue;
            }
            const nodes = new Nodes(this.config.graphqlURL, this.config.rmbClient["proxyURL"]);
            const node_twin_id = await nodes.getNodeTwinId(contract["node_id"]);
            const payload = JSON.stringify({ contract_id: contract["contract_id"] });
            let deployment;
            try {
                deployment = await this.rmb.request([node_twin_id], "zos.deployment.get", payload);
            } catch (e) {
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
            } else {
                await this.save(name, { created: [], deleted: [{ contractId: contract["contract_id"] }] });
            }
        }
        return deployments;
    }

    async _update(
        module: KubernetesHL | ZdbHL | VMHL,
        name: string,
        oldDeployments: Deployment[],
        twinDeployments: TwinDeployment[],
        network: Network = null,
    ) {
        let finalTwinDeployments = [];
        finalTwinDeployments = twinDeployments.filter(d => d.operation === Operations.update);
        twinDeployments = this.twinDeploymentHandler.deployMerge(twinDeployments);
        const deploymentNodeIds = await this._getDeploymentNodeIds(name);
        finalTwinDeployments = finalTwinDeployments.concat(
            twinDeployments.filter(d => !deploymentNodeIds.includes(d.nodeId)),
        );

        for (let oldDeployment of oldDeployments) {
            oldDeployment = await this.deploymentFactory.fromObj(oldDeployment);
            const node_id = await this._getNodeIdFromContractId(name, oldDeployment.contract_id);
            let deploymentFound = false;
            for (const twinDeployment of twinDeployments) {
                if (twinDeployment.nodeId !== node_id) {
                    continue;
                }
                oldDeployment = await this.deploymentFactory.UpdateDeployment(
                    oldDeployment,
                    twinDeployment.deployment,
                    network,
                );
                deploymentFound = true;
                if (!oldDeployment) {
                    continue;
                }
                finalTwinDeployments.push(new TwinDeployment(oldDeployment, Operations.update, 0, 0, network));
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

    async _add(
        deployment_name: string,
        node_id: number,
        oldDeployments: Deployment[],
        twinDeployments: TwinDeployment[],
        network: Network = null,
    ) {
        const finalTwinDeployments = twinDeployments.filter(d => d.operation === Operations.update);
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
                twinDeployment.operation = Operations.update;
                break;
            }
        }
        finalTwinDeployments.push(twinDeployment);
        const contracts = await this.twinDeploymentHandler.handle(finalTwinDeployments);
        await this.save(deployment_name, contracts);
        return { contracts: contracts };
    }

    async _deleteInstance(module: KubernetesHL | ZdbHL | VMHL, deployment_name: string, name: string) {
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

    async _delete(name: string) {
        const contracts = { created: [], deleted: [], updated: [] };
        if (!(await this._list()).includes(name)) {
            return contracts;
        }
        const deployments = await this._get(name);
        const highlvl = new HighLevelBase(this.config);
        for (const deployment of deployments) {
            const twinDeployments = await highlvl._delete(deployment, []);
            const contract = await this.twinDeploymentHandler.handle(twinDeployments);
            contracts.deleted = contracts.deleted.concat(contract["deleted"]);
            contracts.updated = contracts.updated.concat(contract["updated"]);
        }
        const deletedContracts = [];
        for (const c of contracts.deleted) {
            deletedContracts.push(c["contractId"]);
        }
        const updatedContracts = [];
        for (const c of contracts.updated) {
            if (!deletedContracts.includes(c["contractId"])) {
                updatedContracts.push(c);
            }
        }
        contracts.updated = updatedContracts;
        await this.save(name, contracts);
        return contracts;
    }
}
export { BaseModule };
