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
const class_transformer_1 = require("class-transformer");
const znet_1 = require("./znet");
const zmount_1 = require("./zmount");
const zmachine_1 = require("./zmachine");
const zdb_1 = require("./zdb");
const ipv4_1 = require("./ipv4");
const gateway_1 = require("./gateway");
const qsfs_1 = require("./qsfs");
const workload_base_1 = require("./workload_base");
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
class ACE {
    twin_ids;
    rights;
}
class DeploymentResult {
    created;
    state;
    error = "";
    data = "";
}
class Workload {
    version;
    name;
    type;
    data;
    metadata;
    description;
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
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0)
], Workload.prototype, "version", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)()
], Workload.prototype, "name", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_transformer_1.Transform)(({ value }) => WorkloadTypes[value]),
    (0, class_validator_1.IsEnum)(WorkloadTypes)
], Workload.prototype, "type", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => workload_base_1.WorkloadBaseData, {
        discriminator: {
            property: '__type',
            subTypes: [
                { value: zmount_1.Zmount, name: WorkloadTypes.zmount },
                { value: znet_1.Znet, name: WorkloadTypes.network },
                { value: zmachine_1.Zmachine, name: WorkloadTypes.zmachine },
                { value: zdb_1.Zdb, name: WorkloadTypes.zdb },
                { value: ipv4_1.PublicIP, name: WorkloadTypes.ipv4 },
                { value: gateway_1.GatewayFQDNProxy, name: WorkloadTypes.gatewayfqdnproxy },
                { value: gateway_1.GatewayNameProxy, name: WorkloadTypes.gatewaynameproxy },
                { value: qsfs_1.QuantumSafeFS, name: WorkloadTypes.qsfs },
            ],
        },
    })
], Workload.prototype, "data", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsDefined)()
], Workload.prototype, "metadata", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsDefined)()
], Workload.prototype, "description", void 0);
exports.Workload = Workload;
