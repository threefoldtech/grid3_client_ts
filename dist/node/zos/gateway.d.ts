import { WorkloadBaseData } from "./workload_base";
declare class GatewayFQDNProxy extends WorkloadBaseData {
    fqdn: string;
    tls_passthrough: boolean;
    backends: string[];
    challenge(): string;
}
declare class GatewayNameProxy extends WorkloadBaseData {
    name: string;
    tls_passthrough: boolean;
    backends: string[];
    challenge(): string;
}
declare class GatewayResult {
}
export { GatewayFQDNProxy, GatewayNameProxy, GatewayResult };
//# sourceMappingURL=gateway.d.ts.map