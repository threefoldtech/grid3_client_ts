"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeploymentFactory = void 0;
const class_transformer_1 = require("class-transformer");
const validator_1 = require("../helpers/validator");
const deployment_1 = require("../zos/deployment");
const workload_1 = require("../zos/workload");
const nodes_1 = require("./nodes");
class DeploymentFactory {
    twin_id;
    url;
    mnemonic;
    constructor(twin_id, url, mnemonic) {
        this.twin_id = twin_id;
        this.url = url;
        this.mnemonic = mnemonic;
    }
    create(workloads, expiration, metadata = "", description = "", version = 0) {
        const signature_request = new deployment_1.SignatureRequest();
        signature_request.twin_id = this.twin_id;
        signature_request.weight = 1;
        signature_request.required = false;
        const signature_requirement = new deployment_1.SignatureRequirement();
        signature_requirement.weight_required = 1;
        signature_requirement.requests = [signature_request];
        const deployment = new deployment_1.Deployment();
        deployment.version = version;
        deployment.metadata = metadata;
        deployment.description = description;
        deployment.twin_id = this.twin_id;
        deployment.expiration = expiration;
        deployment.workloads = workloads;
        deployment.signature_requirement = signature_requirement;
        return deployment;
    }
    async UpdateDeployment(oldDeployment, newDeployment, network = null) {
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
            if (workload.type === workload_1.WorkloadTypes.network) {
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
                if (w.type === workload_1.WorkloadTypes.network) {
                    continue;
                }
                if (w.name !== workload.name) {
                    continue;
                }
                const oldVersion = workload.version;
                workload.version = 0;
                // Don't change the machine ip
                if (w.type === workload_1.WorkloadTypes.zmachine) {
                    const nodes = new nodes_1.Nodes(this.url);
                    const node_id = await nodes.getNodeIdFromContractId(oldDeployment.contract_id, this.mnemonic);
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
    async fromObj(deployment) {
        for (const workload of deployment.workloads) {
            workload.data["__type"] = workload.type;
            if (workload.result && workload.result.data) {
                workload.result.data["__type"] = workload.type;
            }
        }
        const d = (0, class_transformer_1.plainToClass)(deployment_1.Deployment, deployment, { excludeExtraneousValues: true });
        await (0, validator_1.validateObject)(d);
        return d;
    }
}
exports.DeploymentFactory = DeploymentFactory;
