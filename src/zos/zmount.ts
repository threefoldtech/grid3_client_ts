import { Expose } from "class-transformer";
import { IsInt, Min } from "class-validator";

import { WorkloadData, WorkloadDataResult } from "./workload_base";

class Zmount extends WorkloadData {
    @Expose() @IsInt() @Min(1) size: number; // in bytes

    challenge(): string {
        return this.size.toString();
    }
}

class ZmountResult extends WorkloadDataResult {
    @Expose() volume_id: string;
}
export { Zmount, ZmountResult };
