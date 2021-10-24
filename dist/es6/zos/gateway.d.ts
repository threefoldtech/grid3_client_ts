import { WorkloadData } from "./workload_base";
declare class GatewayFQDNProxy extends WorkloadData {
    fqdn: string;
    tls_passthrough: boolean;
    backends: string[];
    challenge(): string;
}
declare class GatewayNameProxy extends WorkloadData {
    name: string;
    tls_passthrough: boolean;
    backends: string[];
    challenge(): string;
}
export { GatewayFQDNProxy, GatewayNameProxy };
//# sourceMappingURL=gateway.d.ts.map