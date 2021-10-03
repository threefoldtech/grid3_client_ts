declare class GatewayFQDNProxy {
    fqdn: string;
    tls_passthrough: boolean;
    backends: string[];
    challenge(): string;
}
declare class GatewayNameProxy {
    name: string;
    tls_passthrough: boolean;
    backends: string[];
    challenge(): string;
}
declare class GatewayResult {
}
export { GatewayFQDNProxy, GatewayNameProxy, GatewayResult };
