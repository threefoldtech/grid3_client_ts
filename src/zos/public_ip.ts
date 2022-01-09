import { Expose } from "class-transformer";
import { IsBoolean } from "class-validator";

import { WorkloadData, WorkloadDataResult } from "./workload_base";

class PublicIP extends WorkloadData {
    @Expose() @IsBoolean() v4: boolean;
    @Expose() @IsBoolean() v6: boolean;
    challenge(): string {
        return this.v4.toString() + this.v6.toString();
    }
}

class PublicIPResult extends WorkloadDataResult {
    @Expose() ip: string;
    @Expose() ip6: string;
    @Expose() gateway: string;
}

export { PublicIP, PublicIPResult };
