var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Expose, Transform, Type } from "class-transformer";
import { IsDefined, IsEnum, IsInt, IsNotEmpty, IsString, Min, ValidateNested } from "class-validator";
import { GatewayFQDNProxy, GatewayNameProxy } from "./gateway";
import { PublicIPv4, PublicIPv4Result } from "./ipv4"; // TODO: remove deprecated
import { PublicIP, PublicIPResult } from "./public_ip";
import { QuantumSafeFS, QuantumSafeFSResult } from "./qsfs";
import { WorkloadData, WorkloadDataResult } from "./workload_base";
import { Zdb, ZdbResult } from "./zdb";
import { Zmachine, ZmachineResult } from "./zmachine";
import { Zmount, ZmountResult } from "./zmount";
import { Znet } from "./znet";
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
    WorkloadTypes["ip"] = "ip";
    WorkloadTypes["gatewayfqdnproxy"] = "gateway-fqdn-proxy";
    WorkloadTypes["gatewaynameproxy"] = "gateway-name-proxy";
    WorkloadTypes["qsfs"] = "qsfs";
})(WorkloadTypes || (WorkloadTypes = {}));
// enum Right {
//     restart,
//     delete,
//     stats,
//     logs,
// }
// class ACE {
//     twin_ids: number[];
//     rights: Right[];
// }
class DeploymentResult {
}
__decorate([
    Expose(),
    __metadata("design:type", Number)
], DeploymentResult.prototype, "created", void 0);
__decorate([
    Expose(),
    Transform(({ value }) => ResultStates[value]),
    __metadata("design:type", String)
], DeploymentResult.prototype, "state", void 0);
__decorate([
    Expose(),
    __metadata("design:type", String)
], DeploymentResult.prototype, "message", void 0);
__decorate([
    Expose(),
    Type(() => WorkloadDataResult, {
        discriminator: {
            property: "__type",
            subTypes: [
                { value: ZmountResult, name: WorkloadTypes.zmount },
                { value: WorkloadDataResult, name: WorkloadTypes.network },
                { value: ZmachineResult, name: WorkloadTypes.zmachine },
                { value: ZdbResult, name: WorkloadTypes.zdb },
                { value: PublicIPResult, name: WorkloadTypes.ip },
                { value: PublicIPv4Result, name: WorkloadTypes.ipv4 },
                { value: WorkloadDataResult, name: WorkloadTypes.gatewayfqdnproxy },
                { value: WorkloadDataResult, name: WorkloadTypes.gatewaynameproxy },
                { value: QuantumSafeFSResult, name: WorkloadTypes.qsfs },
            ],
        },
    }),
    __metadata("design:type", Object)
], DeploymentResult.prototype, "data", void 0);
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
    Expose(),
    IsInt(),
    Min(0),
    __metadata("design:type", Number)
], Workload.prototype, "version", void 0);
__decorate([
    Expose(),
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], Workload.prototype, "name", void 0);
__decorate([
    Expose(),
    Transform(({ value }) => WorkloadTypes[value.replace(/-/g, "")]) // remove the '-' from the Workloadtype's value to match the key in the reverse parsing from json to obj
    ,
    IsEnum(WorkloadTypes),
    __metadata("design:type", String)
], Workload.prototype, "type", void 0);
__decorate([
    Expose(),
    ValidateNested(),
    Type(() => WorkloadData, {
        discriminator: {
            property: "__type",
            subTypes: [
                { value: Zmount, name: WorkloadTypes.zmount },
                { value: Znet, name: WorkloadTypes.network },
                { value: Zmachine, name: WorkloadTypes.zmachine },
                { value: Zdb, name: WorkloadTypes.zdb },
                { value: PublicIP, name: WorkloadTypes.ip },
                { value: PublicIPv4, name: WorkloadTypes.ipv4 },
                { value: GatewayFQDNProxy, name: WorkloadTypes.gatewayfqdnproxy },
                { value: GatewayNameProxy, name: WorkloadTypes.gatewaynameproxy },
                { value: QuantumSafeFS, name: WorkloadTypes.qsfs },
            ],
        },
    }),
    __metadata("design:type", Object)
], Workload.prototype, "data", void 0);
__decorate([
    Expose(),
    IsString(),
    IsDefined(),
    __metadata("design:type", String)
], Workload.prototype, "metadata", void 0);
__decorate([
    Expose(),
    IsString(),
    IsDefined(),
    __metadata("design:type", String)
], Workload.prototype, "description", void 0);
__decorate([
    Expose(),
    Type(() => DeploymentResult),
    __metadata("design:type", DeploymentResult)
], Workload.prototype, "result", void 0);
export { Workload, WorkloadTypes, DeploymentResult, ResultStates };
