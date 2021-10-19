var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { IsFQDN, IsBoolean, IsString, IsUrl, IsNotEmpty, ArrayNotEmpty } from "class-validator";
class GatewayFQDNProxy {
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
    IsFQDN()
], GatewayFQDNProxy.prototype, "fqdn", void 0);
__decorate([
    IsBoolean()
], GatewayFQDNProxy.prototype, "tls_passthrough", void 0);
__decorate([
    ArrayNotEmpty(),
    IsUrl({ protocols: ["http", "https"] }, { each: true })
], GatewayFQDNProxy.prototype, "backends", void 0);
class GatewayNameProxy {
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
    IsString(),
    IsNotEmpty()
], GatewayNameProxy.prototype, "name", void 0);
__decorate([
    IsBoolean()
], GatewayNameProxy.prototype, "tls_passthrough", void 0);
__decorate([
    ArrayNotEmpty(),
    IsUrl({ protocols: ["http", "https"] }, { each: true })
], GatewayNameProxy.prototype, "backends", void 0);
class GatewayResult {
}
export { GatewayFQDNProxy, GatewayNameProxy, GatewayResult };
