import * as PATH from "path";

import { Deployment } from "../zos/deployment";
import { Zmachine, ZmachineResult } from "../zos/zmachine";
import { Workload, WorkloadTypes } from "../zos/workload";

import { HighLevelBase } from "../high_level/base";
import { TwinDeploymentHandler } from "../high_level/twinDeploymentHandler";
import { TwinDeployment, Operations } from "../high_level/models";
import { KubernetesHL } from "../high_level/kubernetes";
import { ZdbHL } from "../high_level/zdb";
import { loadFromFile, updatejson } from "../helpers/jsonfs";
import { Nodes } from "../primitives/nodes";
import { DeploymentFactory } from "../primitives/deployment";
import { Network } from "../primitives/network";
import { MessageBusClientInterface } from "ts-rmb-client-base";
import { VMHL } from "../high_level/machine";
import { TFClient } from "../tf-grid/client";

class BaseModule {
    projectName = "";
    fileName = "";
    workloadTypes = [];
    deploymentFactory: DeploymentFactory;
    twinDeploymentHandler: TwinDeploymentHandler;

    constructor(
        public twin_id: number,
        public url: string,
        public mnemonic: string,
        public rmbClient: MessageBusClientInterface,
        public storePath: string,
        projectName = "",
    ) {
        this.deploymentFactory = new DeploymentFactory(twin_id, url, mnemonic);
        this.twinDeploymentHandler = new TwinDeploymentHandler(this.rmbClient, twin_id, url, mnemonic);
        this.projectName = projectName;
    }

    _load() {
        const path = PATH.join(this.storePath, this.projectName, this.fileName);
        return [path, loadFromFile(path)];
    }

    save(name: string, contracts: Record<string, unknown[]>, wgConfig = "") {
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
            deploymentData.contracts = deploymentData.contracts.filter(
                c => c["contract_id"] !== contract["contract_id"],
            );
        }
        if (wgConfig) {
            deploymentData["wireguard_config"] = wgConfig;
        }
        if (deploymentData.contracts.length !== 0) {
            updatejson(path, name, deploymentData);
        } else {
            updatejson(path, name, deploymentData, "delete");
        }

        return deploymentData;
    }

    _list(): string[] {
        const [_, data] = this._load();
        return Object.keys(data);
    }

    exists(name: string): boolean {
        return this._list().includes(name);
    }

    _getDeploymentNodeIds(name: string): number[] {
        const nodeIds = [];
        const contracts = this._getContracts(name);
        for (const contract of contracts) {
            nodeIds.push(contract["node_id"]);
        }
        return nodeIds;
    }

    _getContracts(name: string): string[] {
        const [_, data] = this._load();
        if (!Object.keys(data).includes(name)) {
            return [];
        }
        return data[name]["contracts"];
    }

    _getContractIdFromNodeId(name: string, nodeId: number): number {
        const contracts = this._getContracts(name);
        for (const contract of contracts) {
            if (contract["node_id"] === nodeId) {
                return contract["contract_id"];
            }
        }
    }
    _getNodeIdFromContractId(name: string, contractId: number): number {
        const contracts = this._getContracts(name);
        for (const contract of contracts) {
            if (contract["contract_id"] === contractId) {
                return contract["node_id"];
            }
        }
    }

    _getWorkloadsByType(deployments, type: WorkloadTypes): Workload[] {
        let r = [];
        for (const deployment of deployments) {
            for (const workload of deployment.workloads) {
                if (workload.type === type) {
                    r.push(workload);
                }
            }
        }
        return r;
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
            publicIP: data.network.public_ip,
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
                ...this._getZMountData(deployments, m.name),
            })),
            env: data.env,
            entrypoint: data.entrypoint,
            metadata: workload.metadata,
            description: workload.description,
        };
    }

    _getZMountData(deployments, name) {
        for (const deployment of deployments) {
            for (const workload of deployment.workloads) {
                if (workload.type === WorkloadTypes.zmount && workload.name === name) {
                    return { size: workload.data.size, state: workload.result.state, message: workload.result.message };
                }
            }
        }
    }

    async _get(name: string) {
        const [_, data] = this._load();
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
                    this.save(name, { created: [], deleted: [{ contract_id: contract["contract_id"] }] });
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
                this.save(name, { created: [], deleted: [{ contract_id: contract["contract_id"] }] });
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
        const deploymentNodeIds = this._getDeploymentNodeIds(name);
        finalTwinDeployments = finalTwinDeployments.concat(
            twinDeployments.filter(d => !deploymentNodeIds.includes(d.nodeId)),
        );

        for (let oldDeployment of oldDeployments) {
            oldDeployment = await this.deploymentFactory.fromObj(oldDeployment);
            const node_id = this._getNodeIdFromContractId(name, oldDeployment.contract_id);
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
        this.save(name, contracts);
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
                twinDeployment.operation = Operations.update;
                break;
            }
        }
        finalTwinDeployments.push(twinDeployment);
        const contracts = await this.twinDeploymentHandler.handle(finalTwinDeployments);
        this.save(deployment_name, contracts);
        return { contracts: contracts };
    }

    async _deleteInstance(module: KubernetesHL | ZdbHL | VMHL, deployment_name: string, name: string) {
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

    async _delete(name: string) {
        const [path, data] = this._load();
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
        updatejson(path, name, "", "delete");
        return contracts;
    }
}
export { BaseModule };
