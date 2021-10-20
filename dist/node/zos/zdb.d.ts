import { WorkloadData, WorkloadDataResult } from "./workload_base";
declare enum ZdbModes {
    seq = "seq",
    user = "user"
}
declare enum DeviceTypes {
    hdd = "hdd",
    ssd = "ssd"
}
declare class Zdb extends WorkloadData {
    namespace: string;
    size: number;
    mode: ZdbModes;
    password: string;
    disk_type: DeviceTypes;
    public: boolean;
    challenge(): string;
}
declare class ZdbResult extends WorkloadDataResult {
    namespace: string;
    ips: string[];
    port: number;
}
export { Zdb, ZdbResult, ZdbModes, DeviceTypes };
//# sourceMappingURL=zdb.d.ts.map