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
class GatewayResult {
}
export { GatewayFQDNProxy, GatewayNameProxy, GatewayResult };
