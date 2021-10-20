import { IsInt, Min } from "class-validator";
import { Expose } from "class-transformer";

import { WorkloadBaseData } from "./workload_base";


class Zmount extends WorkloadBaseData {
    @Expose() @IsInt() @Min(1) size: number; // in bytes

    challenge() {
        return this.size;
    }
}

class ZmountResult {
    volume_id: string;
}
export { Zmount, ZmountResult };
