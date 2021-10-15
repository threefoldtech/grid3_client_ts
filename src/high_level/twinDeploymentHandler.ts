import { Deployment } from "../zos/deployment";
import { WorkloadTypes } from "../zos/workload";
import { TFClient } from "../tf-grid/client";

import { Operations, TwinDeployment } from "./models";
import { getNodeTwinId } from "../primitives/index";
import { events } from "../helpers/events";

class TwinDeploymentHandler {
    tfclient: TFClient;

    constructor(public rmbClient, public twin_id: number, public url: string, public mnemonic: string) {
        this.tfclient = new TFClient(url, mnemonic);
    }

    async deploy(deployment: Deployment, node_id: number, publicIps: number) {
        await this.tfclient.connect();
        const contract = await this.tfclient.contracts.createNode(node_id, deployment.challenge_hash(), "", publicIps);
        if (contract instanceof Error) {
            throw Error(`Failed to create contract ${contract}`);
        }
        events.emit("logs", `Contract with id: ${contract["contract_id"]} has been created`);
        deployment.contract_id = contract["contract_id"];
        const payload = JSON.stringify(deployment);
        const node_twin_id = await getNodeTwinId(node_id);
        try {
            const msg = this.rmbClient.prepare("zos.deployment.deploy", [node_twin_id], 0, 2);
            const message = await this.rmbClient.send(msg, payload);
            const result = await this.rmbClient.read(message);
            if (result[0].err) {
                throw Error(result[0].err);
            }
        } catch (err) {
            await this.tfclient.contracts.cancel(contract["contract_id"]);
            throw Error(err);
        } finally {
            this.tfclient.disconnect();
        }
        return contract;
    }

    async update(deployment: Deployment, publicIps: number) {
        // TODO: update the contract with public when it is available
        await this.tfclient.connect();
        const contract = await this.tfclient.contracts.updateNode(
            deployment.contract_id,
            "",
            deployment.challenge_hash(),
        );
        if (contract instanceof Error) {
            throw Error(`Failed to update contract ${contract}`);
        }
        events.emit("logs", `Contract with id: ${contract["contract_id"]} has been updated`);

        const payload = JSON.stringify(deployment);
        const node_twin_id = await getNodeTwinId(contract["contract_type"]["nodeContract"]["node_id"]);
        try {
            const msg = this.rmbClient.prepare("zos.deployment.update", [node_twin_id], 0, 2);
            const message = await this.rmbClient.send(msg, payload);
            const result = await this.rmbClient.read(message);
            if (result[0].err) {
                throw Error(result[0].err);
            }
        } catch (err) {
            throw Error(err);
        } finally {
            this.tfclient.disconnect();
        }
        return contract;
    }

    async delete(contract_id: number): Promise<number> {
        await this.tfclient.connect();
        try {
            await this.tfclient.contracts.cancel(contract_id);
        } catch (err) {
            throw Error(`Failed to cancel contract ${contract_id} due to: ${err}`);
        } finally {
            this.tfclient.disconnect();
        }
        return contract_id;
    }

    async getDeployment(contract_id) {
        await this.tfclient.connect();
        const contract = await this.tfclient.contracts.get(contract_id);
        const node_twin_id = await getNodeTwinId(contract["contract_type"]["nodeContract"]["node_id"]);
        const msg = this.rmbClient.prepare("zos.deployment.get", [node_twin_id], 0, 2);
        const payload = { contract_id: contract_id };
        const message = await this.rmbClient.send(msg, JSON.stringify(payload));
        const result = await this.rmbClient.read(message);
        if (result[0].err) {
            console.error(`Could not get deployment ${contract_id} due to error: ${result[0].err} `);
        }
        const res = JSON.parse(result[0].dat);
        return res;
    }

    checkWorkload(workload, targetWorkload) {
        let state = false;
        if (workload.result.state === "error") {
            throw Error(
                `Failed to deploy ${workload.type} with name ${workload.name} due to: ${workload.result.message}`,
            );
        } else if (workload.result.state === "ok") {
            state = true;
        }
        if (workload.version === targetWorkload.version) {
            return state;
        }
        return false;
    }

    async waitForDeployment(twinDeployment: TwinDeployment, timeout = 5) {
        const now = new Date().getTime();
        while (new Date().getTime() < now + timeout * 1000 * 60) {
            const deployment = await this.getDeployment(twinDeployment.deployment.contract_id);
            if (deployment.workloads.length !== twinDeployment.deployment.workloads.length) {
                await new Promise(f => setTimeout(f, 1000));
                continue;
            }
            let readyWorkloads = 0;
            for (let i = 0; i < deployment.workloads.length; i++) {
                if (this.checkWorkload(deployment.workloads[i], twinDeployment.deployment.workloads[i])) {
                    readyWorkloads += 1;
                }
            }
            if (readyWorkloads === twinDeployment.deployment.workloads.length) {
                return true;
            }
            await new Promise(f => setTimeout(f, 1000));
        }
    }

    async waitForDeployments(twinDeployments: TwinDeployment[], timeout = 5) {
        const promises = [];
        for (const twinDeployment of twinDeployments) {
            if ([Operations.deploy, Operations.update].includes(twinDeployment.operation)) {
                events.emit("logs",
                    `Waiting for deployment with contract_id: ${twinDeployment.deployment.contract_id} to be ready`,
                );
                promises.push(this.waitForDeployment(twinDeployment, timeout));
            }
        }
        for (const promise of promises) {
            if (!(await promise)) {
                return false;
            }
        }
        return true;
    }

    deployMerge(twinDeployments: TwinDeployment[]): TwinDeployment[] {
        const deploymentMap = {};
        for (const twinDeployment of twinDeployments) {
            if (twinDeployment.operation !== Operations.deploy) {
                continue;
            }
            if (Object.keys(deploymentMap).includes(twinDeployment.nodeId.toString())) {
                deploymentMap[twinDeployment.nodeId].deployment.workloads = deploymentMap[
                    twinDeployment.nodeId
                ].deployment.workloads.concat(twinDeployment.deployment.workloads);
                deploymentMap[twinDeployment.nodeId].publicIps += twinDeployment.publicIps;
            } else {
                deploymentMap[twinDeployment.nodeId] = twinDeployment;
            }
        }

        const deployments = [];
        for (const key of Object.keys(deploymentMap)) {
            deployments.push(deploymentMap[key]);
        }
        return deployments;
    }

    _updateToLatest(twinDeployments: TwinDeployment[]): TwinDeployment {
        // all deployment pass should be with the same contract id to merge them to one deployment with all updates
        if (twinDeployments.length === 0) {
            return;
        } else if (twinDeployments.length === 1) {
            twinDeployments[0].deployment.version += 1;
            return twinDeployments[0];
        }

        const workloadMap = {};
        let publicIps = 0;
        let network = null;
        for (const twinDeployment of twinDeployments) {
            for (const workload of twinDeployment.deployment.workloads) {
                if (Object.keys(workloadMap).includes(workload.name)) {
                    workloadMap[workload.name].push(workload);
                } else {
                    workloadMap[workload.name] = [workload];
                }
            }
            publicIps += twinDeployment.publicIps;
            if (!network && twinDeployment.network) {
                network = twinDeployment.network;
            }
        }

        const workloads = [];
        for (const name of Object.keys(workloadMap)) {
            let w = workloadMap[name][0];
            if (
                workloadMap[name].length < twinDeployments.length &&
                w.version <= twinDeployments[0].deployment.version
            ) {
                continue;
            }
            for (const workload of workloadMap[name]) {
                if (w.version < workload.version) {
                    w = workload;
                }
            }
            workloads.push(w);
        }
        const d = twinDeployments[0];
        d.deployment.workloads = workloads;
        d.publicIps = publicIps;
        d.network = network;
        d.deployment.version += 1;
        return d;
    }

    updateMerge(twinDeployments: TwinDeployment[]): TwinDeployment[] {
        const deploymentMap = {};
        for (const twinDeployment of twinDeployments) {
            if (twinDeployment.operation !== Operations.update) {
                continue;
            }
            if (Object.keys(deploymentMap).includes(String(twinDeployment.deployment.contract_id))) {
                deploymentMap[twinDeployment.deployment.contract_id].push(twinDeployment);
            } else {
                deploymentMap[twinDeployment.deployment.contract_id] = [twinDeployment];
            }
        }
        const deployments = [];
        for (const key of Object.keys(deploymentMap)) {
            deployments.push(this._updateToLatest(deploymentMap[key]));
        }
        return deployments;
    }

    merge(twinDeployments: TwinDeployment[]): TwinDeployment[] {
        let deployments = [];
        deployments = deployments.concat(this.deployMerge(twinDeployments));
        const deletedDeployments = twinDeployments.filter(d => d.operation === Operations.delete);
        const deletedContracts = [];
        for (const d of deletedDeployments) {
            deletedContracts.push(d.deployment.contract_id);
        }
        const updatedDeployment = this.updateMerge(twinDeployments);
        deployments = deployments.concat(
            updatedDeployment.filter(d => !deletedContracts.includes(d.deployment.contract_id)),
        );
        deployments = deployments.concat(deletedDeployments);
        return deployments;
    }

    async handle(twinDeployments: TwinDeployment[]) {
        events.emit("logs", "Merging workloads");
        twinDeployments = this.merge(twinDeployments);
        const contracts = { created: [], updated: [], deleted: [] };
        //TODO: check if it can be done to save the deployment here instead of doing this in the module.
        for (const twinDeployment of twinDeployments) {
            for (const workload of twinDeployment.deployment.workloads) {
                if (!twinDeployment.network) {
                    break;
                }
                if (workload.type === WorkloadTypes.network) {
                    events.emit("logs", `Updating network workload with name: ${workload.name}`);
                    workload["data"] = twinDeployment.network.updateNetwork(workload.data);
                }
            }
            if (twinDeployment.operation === Operations.deploy) {
                twinDeployment.deployment.sign(this.twin_id, this.mnemonic);
                events.emit("logs", `Deploying on node_id: ${twinDeployment.nodeId}`);
                const contract = await this.deploy(
                    twinDeployment.deployment,
                    twinDeployment.nodeId,
                    twinDeployment.publicIps,
                );
                twinDeployment.deployment.contract_id = contract["contract_id"];
                contracts.created.push(contract);
                if (twinDeployment.network) {
                    await twinDeployment.network.save(contract["contract_id"], contract["contract_type"]["nodeContract"]["node_id"]);
                }
                events.emit("logs",
                    `A deployment has been created on node_id: ${twinDeployment.nodeId} with contract_id: ${contract["contract_type"]["nodeContract"]["node_id"]}`,
                );
            } else if (twinDeployment.operation === Operations.update) {
                twinDeployment.deployment.sign(this.twin_id, this.mnemonic);
                events.emit("logs", `Updating deployment with contract_id: ${twinDeployment.deployment.contract_id}`);
                const contract = await this.update(twinDeployment.deployment, twinDeployment.publicIps);
                contracts.updated.push(contract);
                if (twinDeployment.network) {
                    await twinDeployment.network.save(contract["contract_id"], contract["contract_type"]["nodeContract"]["node_id"]);
                }
                events.emit("logs", `Deployment has been updated with contract_id: ${contract["contract_id"]}`);
            } else if (twinDeployment.operation === Operations.delete) {
                events.emit("logs", `Deleting deployment with contract_id: ${twinDeployment.deployment.contract_id}`);
                const contract = await this.delete(twinDeployment.deployment.contract_id);
                contracts.deleted.push({ contract_id: contract });
                if (twinDeployment.network) {
                    await twinDeployment.network.save();
                }
                events.emit("logs", `Deployment has been deleted with contract_id: ${contract}`);
            }
        }
        await this.waitForDeployments(twinDeployments);
        return contracts;
    }
}

export { TwinDeploymentHandler };
