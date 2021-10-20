import { IsInt, Min } from "class-validator";
import { Expose } from "class-transformer";

import { WorkloadData, WorkloadDataResult } from "./workload_base";


class Zmount extends WorkloadData {
    @Expose() @IsInt() @Min(1) size: number; // in bytes

    challenge() {
        return this.size;
    }
}

class ZmountResult extends WorkloadDataResult {
    @Expose() volume_id: string;
}
export { Zmount, ZmountResult };
