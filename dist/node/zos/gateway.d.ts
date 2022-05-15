import { WorkloadData, WorkloadDataResult } from "./workload_base";
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
declare class GatewayResult extends WorkloadDataResult {
    fqdn: string;
}
export { GatewayFQDNProxy, GatewayNameProxy, GatewayResult };
//# sourceMappingURL=gateway.d.ts.map