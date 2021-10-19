"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GatewayResult = exports.GatewayNameProxy = exports.GatewayFQDNProxy = void 0;
const class_validator_1 = require("class-validator");
class GatewayFQDNProxy {
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
    (0, class_validator_1.IsFQDN)()
], GatewayFQDNProxy.prototype, "fqdn", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)()
], GatewayFQDNProxy.prototype, "tls_passthrough", void 0);
__decorate([
    (0, class_validator_1.ArrayNotEmpty)(),
    (0, class_validator_1.IsUrl)({ protocols: ["http", "https"] }, { each: true })
], GatewayFQDNProxy.prototype, "backends", void 0);
exports.GatewayFQDNProxy = GatewayFQDNProxy;
class GatewayNameProxy {
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
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)()
], GatewayNameProxy.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)()
], GatewayNameProxy.prototype, "tls_passthrough", void 0);
__decorate([
    (0, class_validator_1.ArrayNotEmpty)(),
    (0, class_validator_1.IsUrl)({ protocols: ["http", "https"] }, { each: true })
], GatewayNameProxy.prototype, "backends", void 0);
exports.GatewayNameProxy = GatewayNameProxy;
class GatewayResult {
}
exports.GatewayResult = GatewayResult;
