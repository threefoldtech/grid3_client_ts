import { WorkloadData, WorkloadDataResult } from "./workload_base";
declare class PublicIPv4 extends WorkloadData {
    challenge(): string;
}
declare class PublicIPv4Result extends WorkloadDataResult {
    ip: string;
    gateway: string;
}
export { PublicIPv4, PublicIPv4Result };
//# sourceMappingURL=ipv4.d.ts.map