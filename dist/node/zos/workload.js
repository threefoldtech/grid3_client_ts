"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkloadTypes = exports.Workload = void 0;
const class_validator_1 = require("class-validator");
var ResultStates;
(function (ResultStates) {
    ResultStates["error"] = "error";
    ResultStates["ok"] = "ok";
    ResultStates["deleted"] = "deleted";
})(ResultStates || (ResultStates = {}));
var WorkloadTypes;
(function (WorkloadTypes) {
    WorkloadTypes["zmachine"] = "zmachine";
    WorkloadTypes["zmount"] = "zmount";
    WorkloadTypes["network"] = "network";
    WorkloadTypes["zdb"] = "zdb";
    WorkloadTypes["ipv4"] = "ipv4";
    WorkloadTypes["gatewayfqdnproxy"] = "gateway-fqdn-proxy";
    WorkloadTypes["gatewaynameproxy"] = "gateway-name-proxy";
    WorkloadTypes["qsfs"] = "qsfs";
})(WorkloadTypes || (WorkloadTypes = {}));
exports.WorkloadTypes = WorkloadTypes;
var Right;
(function (Right) {
    Right[Right["restart"] = 0] = "restart";
    Right[Right["delete"] = 1] = "delete";
    Right[Right["stats"] = 2] = "stats";
    Right[Right["logs"] = 3] = "logs";
})(Right || (Right = {}));
// Access Control Entry
class ACE {
    // the administrator twin id
    twin_ids;
    rights;
}
class DeploymentResult {
    created;
    state;
    error = "";
    data = ""; // also json.RawMessage
}
class Workload {
    version;
    // unique name per Deployment
    name;
    type;
    // this should be something like json.RawMessage in golang
    data; // serialize({size: 10}) ---> "data": {size:10},
    metadata;
    description;
    // list of Access Control Entries
    // what can an administrator do
    // not implemented in zos
    // acl []ACE
    result;
    challenge() {
        let out = "";
        out += this.version;
        out += this.type.toString();
        out += this.metadata;
        out += this.description;
        out += this.data.challenge();
        return out;
    }
}
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0)
], Workload.prototype, "version", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)()
], Workload.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)()
], Workload.prototype, "data", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsDefined)()
], Workload.prototype, "metadata", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsDefined)()
], Workload.prototype, "description", void 0);
exports.Workload = Workload;
