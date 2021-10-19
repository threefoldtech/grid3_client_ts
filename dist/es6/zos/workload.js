var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { IsString, IsNotEmpty, IsDefined, IsInt, Min, ValidateNested } from "class-validator";
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
var Right;
(function (Right) {
    Right[Right["restart"] = 0] = "restart";
    Right[Right["delete"] = 1] = "delete";
    Right[Right["stats"] = 2] = "stats";
    Right[Right["logs"] = 3] = "logs";
})(Right || (Right = {}));
// Access Control Entry
class ACE {
}
class DeploymentResult {
    constructor() {
        this.error = "";
        this.data = ""; // also json.RawMessage
    }
}
class Workload {
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
    IsInt(),
    Min(0)
], Workload.prototype, "version", void 0);
__decorate([
    IsString(),
    IsNotEmpty()
], Workload.prototype, "name", void 0);
__decorate([
    ValidateNested()
], Workload.prototype, "data", void 0);
__decorate([
    IsString(),
    IsDefined()
], Workload.prototype, "metadata", void 0);
__decorate([
    IsString(),
    IsDefined()
], Workload.prototype, "description", void 0);
// pub fn(mut w WorkloadData) challenge() string {
// 	return w.challenge()
// }
export { Workload, WorkloadTypes };
