// TODO:---------Deprecated ------------------------------------//

import { Expose } from "class-transformer";

import { WorkloadData, WorkloadDataResult } from "./workload_base";
class PublicIPv4 extends WorkloadData {
    challenge(): string {
        return "";
    }
}

class PublicIPv4Result extends WorkloadDataResult {
    @Expose() ip: string;
    @Expose() gateway: string;
}

export { PublicIPv4, PublicIPv4Result };
