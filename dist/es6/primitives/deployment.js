var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { plainToClass } from "class-transformer";
import { validateObject } from "../helpers/validator";
import { Deployment, SignatureRequest, SignatureRequirement } from "../zos/deployment";
import { WorkloadTypes } from "../zos/workload";
import { Nodes } from "./nodes";
class DeploymentFactory {
    constructor(twin_id, url, mnemonic) {
        this.twin_id = twin_id;
        this.url = url;
        this.mnemonic = mnemonic;
    }
    create(workloads, expiration, metadata = "", description = "", version = 0) {
        const signature_request = new SignatureRequest();
        signature_request.twin_id = this.twin_id;
        signature_request.weight = 1;
        signature_request.required = false;
        const signature_requirement = new SignatureRequirement();
        signature_requirement.weight_required = 1;
        signature_requirement.requests = [signature_request];
        const deployment = new Deployment();
        deployment.version = version;
        deployment.metadata = metadata;
        deployment.description = description;
        deployment.twin_id = this.twin_id;
        deployment.expiration = expiration;
        deployment.workloads = workloads;
        deployment.signature_requirement = signature_requirement;
        return deployment;
    }
    UpdateDeployment(oldDeployment, newDeployment, network = null) {
        return __awaiter(this, void 0, void 0, function* () {
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
                        const nodes = new Nodes(this.url);
                        const node_id = yield nodes.getNodeIdFromContractId(oldDeployment.contract_id, this.mnemonic);
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
        });
    }
    fromObj(deployment) {
        return __awaiter(this, void 0, void 0, function* () {
            for (const workload of deployment.workloads) {
                workload.data["__type"] = workload.type;
                if (workload.result) {
                    workload.result.data["__type"] = workload.type;
                }
            }
            const d = plainToClass(Deployment, deployment, { excludeExtraneousValues: true });
            yield validateObject(d);
            return d;
        });
    }
}
export { DeploymentFactory };
