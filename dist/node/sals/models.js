"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Workload = exports.Deployment = exports.WorkloadResult = exports.WorkloadState = exports.WorkloadTypes = void 0;
class Deployment {
    version;
    twinId;
    metadata;
    description;
    contractId;
    expiration;
    workloads;
    loadFromJSON(d) {
        this.version = +d.version;
        this.twinId = +d.twinId;
        this.metadata = `${d.metadata}`;
        this.description = `${d.description}`;
        this.contractId = +d.contractId;
        this.expiration = +d.expiration;
        this.workloads = this.loadWorkloadsFromJSON(d.workloads);
    }
    loadWorkloadsFromJSON(a) {
        let ret = [];
        a.forEach(w => {
            const workload = new Workload();
            workload.loadFromJSON(w);
            ret.push(workload);
        });
        return ret;
    }
}
exports.Deployment = Deployment;
class Workload {
    version;
    name;
    type;
    data;
    result;
    loadFromJSON(w) {
        this.version = +w.version;
        this.name = `${w.name}`;
        this.type = WorkloadTypes[`${w.type}`];
        this.data = JSON.parse(`${w.data}`);
        const result = new WorkloadResult();
        result.loadFromJSON(w.result);
        this.result = result;
    }
}
exports.Workload = Workload;
class WorkloadResult {
    created;
    state;
    message;
    data;
    loadFromJSON(r) {
        this.created = +r.created;
        this.state = WorkloadState[`${r.state}`];
        this.message = `${r.message}`;
        this.data = r.data;
    }
}
exports.WorkloadResult = WorkloadResult;
var WorkloadTypes;
(function (WorkloadTypes) {
    WorkloadTypes[WorkloadTypes["network"] = 0] = "network";
    WorkloadTypes[WorkloadTypes["zmount"] = 1] = "zmount";
    WorkloadTypes[WorkloadTypes["zmachine"] = 2] = "zmachine";
    WorkloadTypes[WorkloadTypes["K8S"] = 3] = "K8S";
    WorkloadTypes[WorkloadTypes["zdb"] = 4] = "zdb";
})(WorkloadTypes || (WorkloadTypes = {}));
exports.WorkloadTypes = WorkloadTypes;
var WorkloadState;
(function (WorkloadState) {
    WorkloadState[WorkloadState["ok"] = 0] = "ok";
    WorkloadState[WorkloadState["error"] = 1] = "error";
    WorkloadState[WorkloadState["deleted"] = 2] = "deleted";
})(WorkloadState || (WorkloadState = {}));
exports.WorkloadState = WorkloadState;
