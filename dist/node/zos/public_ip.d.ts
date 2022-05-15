import { WorkloadData, WorkloadDataResult } from "./workload_base";
declare class PublicIP extends WorkloadData {
    v4: boolean;
    v6: boolean;
    challenge(): string;
}
declare class PublicIPResult extends WorkloadDataResult {
    ip: string;
    ip6: string;
    gateway: string;
}
export { PublicIP, PublicIPResult };
//# sourceMappingURL=public_ip.d.ts.map