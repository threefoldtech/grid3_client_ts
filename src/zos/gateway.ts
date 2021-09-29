class GatewayFQDNProxy {
    fqdn: string
    tls_passthrough: boolean
    backends: string[]

    challenge() {
        let out = "";
        out += this.fqdn;
        out += this.tls_passthrough.toString()
        out += this.backends.toString()
    }
}

class GatewayNameProxy {
    name: string
    tls_passthrough: boolean
    backends: string[]

    challenge() {
        let out = "";
        out += this.name;
        out += this.tls_passthrough.toString()
        out += this.backends.toString()
    }
}

class GatewayResult{

}

export {GatewayFQDNProxy, GatewayNameProxy, GatewayResult}