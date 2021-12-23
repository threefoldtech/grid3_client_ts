import { Expose } from "class-transformer";

import { WorkloadData, WorkloadDataResult } from "./workload_base";
class PublicIP extends WorkloadData {
    challenge(): string {
        return "";
    }
}

class PublicIPResult extends WorkloadDataResult {
    @Expose() ip: string;
    @Expose() gateway: string;
}

export { PublicIP, PublicIPResult };
