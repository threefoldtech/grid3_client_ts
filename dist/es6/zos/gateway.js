var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Expose } from "class-transformer";
import { ArrayNotEmpty, IsBoolean, IsFQDN, IsNotEmpty, IsString, IsUrl } from "class-validator";
import { WorkloadData, WorkloadDataResult } from "./workload_base";
class GatewayFQDNProxy extends WorkloadData {
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
    Expose(),
    IsFQDN(),
    __metadata("design:type", String)
], GatewayFQDNProxy.prototype, "fqdn", void 0);
__decorate([
    Expose(),
    IsBoolean(),
    __metadata("design:type", Boolean)
], GatewayFQDNProxy.prototype, "tls_passthrough", void 0);
__decorate([
    Expose(),
    ArrayNotEmpty(),
    IsUrl({ protocols: ["http", "https"] }, { each: true }),
    __metadata("design:type", Array)
], GatewayFQDNProxy.prototype, "backends", void 0);
class GatewayNameProxy extends WorkloadData {
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
    Expose(),
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], GatewayNameProxy.prototype, "name", void 0);
__decorate([
    Expose(),
    IsBoolean(),
    __metadata("design:type", Boolean)
], GatewayNameProxy.prototype, "tls_passthrough", void 0);
__decorate([
    Expose(),
    ArrayNotEmpty(),
    IsUrl({ protocols: ["http", "https"] }, { each: true }),
    __metadata("design:type", Array)
], GatewayNameProxy.prototype, "backends", void 0);
class GatewayResult extends WorkloadDataResult {
}
export { GatewayFQDNProxy, GatewayNameProxy, GatewayResult };
