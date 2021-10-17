import { WorkloadData, WorkloadDataResult } from "./workload_base";
declare class PublicIP extends WorkloadData {
    challenge(): string;
}
declare class PublicIPResult extends WorkloadDataResult {
    ip: string;
    gateway: string;
}
export { PublicIP, PublicIPResult };
//# sourceMappingURL=ipv4.d.ts.map