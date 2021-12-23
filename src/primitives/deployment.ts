import { plainToInstance } from "class-transformer";

import { GridClientConfig } from "../config";
import { validateObject } from "../helpers/validator";
import { Deployment, SignatureRequest, SignatureRequirement } from "../zos/deployment";
import { Workload } from "../zos/workload";
import { WorkloadTypes } from "../zos/workload";
import { Network } from "./network";
import { Nodes } from "./nodes";

class DeploymentFactory {
    constructor(public config: GridClientConfig) {}

    create(workloads: Workload[], expiration: number, metadata = "", description = "", version = 0): Deployment {
        const signature_request = new SignatureRequest();
        signature_request.twin_id = this.config.twinId;
        signature_request.weight = 1;
        signature_request.required = false;

        const signature_requirement = new SignatureRequirement();
        signature_requirement.weight_required = 1;
        signature_requirement.requests = [signature_request];

        const deployment = new Deployment();
        deployment.version = version;
        deployment.metadata = metadata;
        deployment.description = description;
        deployment.twin_id = this.config.twinId;
        deployment.expiration = expiration;
        deployment.workloads = workloads;
        deployment.signature_requirement = signature_requirement;

        return deployment;
    }

    async UpdateDeployment(
        oldDeployment: Deployment,
        newDeployment: Deployment,
        network: Network = null,
    ): Promise<Deployment> {
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
            if (workload.type === WorkloadTypes.network) {
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
                if (w.type === WorkloadTypes.network) {
                    continue;
                }
                if (w.name !== workload.name) {
                    continue;
                }
                const oldVersion = workload.version;
                workload.version = 0;
                // Don't change the machine ip
                if (w.type === WorkloadTypes.zmachine) {
                    const nodes = new Nodes(this.config.graphqlURL, this.config.rmbClient["proxyURL"]);
                    const node_id = await nodes.getNodeIdFromContractId(
                        oldDeployment.contract_id,
                        this.config.mnemonic,
                    );
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

    async fromObj(deployment): Promise<Deployment> {
        for (const workload of deployment.workloads) {
            workload.data["__type"] = workload.type;
            if (workload.result && workload.result.data) {
                workload.result.data["__type"] = workload.type;
            }
        }
        const d = plainToInstance(Deployment, deployment, { excludeExtraneousValues: true });
        await validateObject(d);
        return d;
    }
}
export { DeploymentFactory };
