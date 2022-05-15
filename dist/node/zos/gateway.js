"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GatewayResult = exports.GatewayNameProxy = exports.GatewayFQDNProxy = void 0;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const workload_base_1 = require("./workload_base");
class GatewayFQDNProxy extends workload_base_1.WorkloadData {
    fqdn;
    tls_passthrough;
    backends;
    challenge() {
        let out = "";
        out += this.fqdn;
        out += this.tls_passthrough.toString();
        for (const backend of this.backends) {
            out += backend;
        }
        return out;
    }
}
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsFQDN)(),
    __metadata("design:type", String)
], GatewayFQDNProxy.prototype, "fqdn", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], GatewayFQDNProxy.prototype, "tls_passthrough", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.ArrayNotEmpty)(),
    (0, class_validator_1.IsUrl)({ protocols: ["http", "https"] }, { each: true }),
    __metadata("design:type", Array)
], GatewayFQDNProxy.prototype, "backends", void 0);
exports.GatewayFQDNProxy = GatewayFQDNProxy;
class GatewayNameProxy extends workload_base_1.WorkloadData {
    name;
    tls_passthrough;
    backends;
    challenge() {
        let out = "";
        out += this.name;
        out += this.tls_passthrough.toString();
        for (const backend of this.backends) {
            out += backend;
        }
        return out;
    }
}
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], GatewayNameProxy.prototype, "name", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], GatewayNameProxy.prototype, "tls_passthrough", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.ArrayNotEmpty)(),
    (0, class_validator_1.IsUrl)({ protocols: ["http", "https"] }, { each: true }),
    __metadata("design:type", Array)
], GatewayNameProxy.prototype, "backends", void 0);
exports.GatewayNameProxy = GatewayNameProxy;
class GatewayResult extends workload_base_1.WorkloadDataResult {
    fqdn;
}
exports.GatewayResult = GatewayResult;
