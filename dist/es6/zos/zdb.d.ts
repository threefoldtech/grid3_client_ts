import { WorkloadData, WorkloadDataResult } from "./workload_base";
declare enum ZdbModes {
    seq = "seq",
    user = "user"
}
declare class Zdb extends WorkloadData {
    size: number;
    mode: ZdbModes;
    password: string;
    public: boolean;
    challenge(): string;
}
declare class ZdbResult extends WorkloadDataResult {
    Namespace: string;
    IPs: string[];
    Port: number;
}
export { Zdb, ZdbResult, ZdbModes };
//# sourceMappingURL=zdb.d.ts.map