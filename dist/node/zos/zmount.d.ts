import { WorkloadData, WorkloadDataResult } from "./workload_base";
declare class Zmount extends WorkloadData {
    size: number;
    challenge(): string;
}
declare class ZmountResult extends WorkloadDataResult {
    volume_id: string;
}
export { Zmount, ZmountResult };
//# sourceMappingURL=zmount.d.ts.map