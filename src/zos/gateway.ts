class GatewayFQDNProxy {
    fqdn: string;
    tls_passthrough: boolean;
    backends: string[];

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
    name: string;
    tls_passthrough: boolean;
    backends: string[];

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

class GatewayResult {}

export { GatewayFQDNProxy, GatewayNameProxy, GatewayResult };
