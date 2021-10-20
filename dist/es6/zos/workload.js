var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { IsString, IsNotEmpty, IsDefined, IsInt, Min, ValidateNested, IsEnum } from "class-validator";
import { Expose, Transform, Type } from "class-transformer";
import { Znet } from "./znet";
import { Zmount } from "./zmount";
import { Zmachine } from "./zmachine";
import { Zdb } from "./zdb";
import { PublicIP } from "./ipv4";
import { GatewayFQDNProxy, GatewayNameProxy } from "./gateway";
import { QuantumSafeFS } from "./qsfs";
import { WorkloadBaseData } from "./workload_base";
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
class ACE {
}
class DeploymentResult {
    constructor() {
        this.error = "";
        this.data = "";
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
    Expose(),
    IsInt(),
    Min(0)
], Workload.prototype, "version", void 0);
__decorate([
    Expose(),
    IsString(),
    IsNotEmpty()
], Workload.prototype, "name", void 0);
__decorate([
    Expose(),
    Transform(({ value }) => WorkloadTypes[value]),
    IsEnum(WorkloadTypes)
], Workload.prototype, "type", void 0);
__decorate([
    Expose(),
    ValidateNested(),
    Type(() => WorkloadBaseData, {
        discriminator: {
            property: '__type',
            subTypes: [
                { value: Zmount, name: WorkloadTypes.zmount },
                { value: Znet, name: WorkloadTypes.network },
                { value: Zmachine, name: WorkloadTypes.zmachine },
                { value: Zdb, name: WorkloadTypes.zdb },
                { value: PublicIP, name: WorkloadTypes.ipv4 },
                { value: GatewayFQDNProxy, name: WorkloadTypes.gatewayfqdnproxy },
                { value: GatewayNameProxy, name: WorkloadTypes.gatewaynameproxy },
                { value: QuantumSafeFS, name: WorkloadTypes.qsfs },
            ],
        },
    })
], Workload.prototype, "data", void 0);
__decorate([
    Expose(),
    IsString(),
    IsDefined()
], Workload.prototype, "metadata", void 0);
__decorate([
    Expose(),
    IsString(),
    IsDefined()
], Workload.prototype, "description", void 0);
export { Workload, WorkloadTypes };
