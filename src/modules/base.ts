import * as PATH from "path";

import { Deployment } from "../zos/deployment";
import { PublicIPResult } from "../zos/ipv4";
import { Zmachine, ZmachineResult } from "../zos/zmachine";
import { Workload, WorkloadTypes } from "../zos/workload";

import { HighLevelBase } from "../high_level/base";
import { TwinDeploymentHandler } from "../high_level/twinDeploymentHandler";
import { TwinDeployment, Operations } from "../high_level/models";
import { KubernetesHL } from "../high_level/kubernetes";
import { ZdbHL } from "../high_level/zdb";
import { BackendStorage, BackendStorageType, StorageUpdateAction } from "../storage/backend";
import { Nodes } from "../primitives/nodes";
import { DeploymentFactory } from "../primitives/deployment";
import { Network } from "../primitives/network";
import { MessageBusClientInterface } from "ts-rmb-client-base";
import { VMHL } from "../high_level/machine";
import { TFClient } from "../clients/tf-grid/client";

class BaseModule {
    fileName = "";
    workloadTypes = [];
    deploymentFactory: DeploymentFactory;
    twinDeploymentHandler: TwinDeploymentHandler;
    backendStorage: BackendStorage;

    constructor(
        public twin_id: number,
        public url: string,
        public mnemonic: string,
        public rmbClient: MessageBusClientInterface,
        public storePath: string,
        public projectName: string = "",
        public backendStorageType: BackendStorageType = BackendStorageType.default
    ) {
        this.deploymentFactory = new DeploymentFactory(twin_id, url, mnemonic);
        this.twinDeploymentHandler = new TwinDeploymentHandler(this.rmbClient, twin_id, url, mnemonic);
        this.backendStorage = new BackendStorage(backendStorageType);
    }

    async _load() {
        const path = PATH.join(this.storePath, this.projectName, this.fileName);

        return [path, await this.backendStorage.load(path)];
    }

    async save(name: string, contracts: Record<string, unknown[]>, wgConfig = "") {
        const [path, data] = await this._load();
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
            deploymentData.contracts = deploymentData.contracts.filter(
                c => c["contract_id"] !== contract["contract_id"],
            );
        }
        if (wgConfig) {
            deploymentData["wireguard_config"] = wgConfig;
        }
        if (deploymentData.contracts.length !== 0) {
            await this.backendStorage.update(path, name, deploymentData);
        } else {
            await this.backendStorage.update(path, name, deploymentData, StorageUpdateAction.delete);
        }

        return deploymentData;
    }

    async _list(): Promise<string[]> {
        const [_, data] = await this._load();
        return Object.keys(data);
    }

    async exists(name: string): Promise<boolean> {
        return (await this._list()).includes(name);
    }

    async _getDeploymentNodeIds(name: string): Promise<number[]> {
        const nodeIds = [];
        const contracts = await this._getContracts(name);
        for (const contract of contracts) {
            nodeIds.push(contract["node_id"]);
        }
        return nodeIds;
    }

    async _getContracts(name: string): Promise<string[]> {
        const [_, data] = await this._load();
        if (!Object.keys(data).includes(name)) {
            return [];
        }
        return data[name]["contracts"];
    }

    async _getContractIdFromNodeId(name: string, nodeId: number): Promise<number> {
        const contracts = await this._getContracts(name);
        for (const contract of contracts) {
            if (contract["node_id"] === nodeId) {
                return contract["contract_id"];
            }
        }
    }
    async _getNodeIdFromContractId(name: string, contractId: number): Promise<number> {
        const contracts = await this._getContracts(name);
        for (const contract of contracts) {
            if (contract["contract_id"] === contractId) {
                return contract["node_id"];
            }
        }
    }

    _getWorkloadsByTypes(deployments, types: WorkloadTypes[]): Workload[] {
        const r = [];
        for (const deployment of deployments) {
            for (const workload of deployment.workloads) {
                if (types.includes(workload.type)) {
                    r.push(workload);
                }
            }
        }
        return r;
    }

    _getMachinePubIP(deployments, ipv4WorkloadName: string): PublicIPResult {
        const ipv4Workloads = this._getWorkloadsByTypes(deployments, [WorkloadTypes.ipv4]);
        for (const workload of ipv4Workloads) {
            if (workload.name === ipv4WorkloadName) {
                return workload.result.data as PublicIPResult;
            }
        }
        return null;
    }

    _getZmachineData(deployments, workload: Workload): Record<string, unknown> {
        const data = workload.data as Zmachine;
        return {
            version: workload.version,
            name: workload.name,
            created: workload.result.created,
            status: workload.result.state,
            message: workload.result.message,
            flist: data.flist,
            publicIP: this._getMachinePubIP(deployments, data.network.public_ip),
            planetary: data.network.planetary,
            yggIP: data.network.planetary ? (workload.result.data as ZmachineResult).ygg_ip : "",
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
    };

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
                    };
                }
            }
        }
    }

    async _get(name: string) {
        const [_, data] = await this._load();
        if (!Object.keys(data).includes(name)) {
            return [];
        }
        const deployments = [];
        for (const contract of data[name]["contracts"]) {
            const tfClient = new TFClient(this.url, this.mnemonic);
            try {
                await tfClient.connect();
                const c = await tfClient.contracts.get(contract["contract_id"]);
                if (c.state !== "Created") {
                    await this.save(name, { created: [], deleted: [{ contract_id: contract["contract_id"] }] });
                    continue;
                }
            } finally {
                tfClient.disconnect();
            }
            const nodes = new Nodes(this.url);
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
            } else {
                await this.save(name, { created: [], deleted: [{ contract_id: contract["contract_id"] }] });
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
        throw Error(`instance with name ${name} is not found`);
    }

    async _delete(name: string) {
        const [path, data] = await this._load();
        const contracts = { deleted: [], updated: [] };
        if (!Object.keys(data).includes(name)) {
            return contracts;
        }
        const deployments = await this._get(name);
        const highlvl = new HighLevelBase(this.twin_id, this.url, this.mnemonic, this.rmbClient, this.storePath);
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
        await this.backendStorage.update(path, name, "", StorageUpdateAction.delete);
        return contracts;
    }
}
export { BaseModule };
