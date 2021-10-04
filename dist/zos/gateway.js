"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GatewayResult = exports.GatewayNameProxy = exports.GatewayFQDNProxy = void 0;
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
exports.GatewayNameProxy = GatewayNameProxy;
class GatewayResult {
}
exports.GatewayResult = GatewayResult;
