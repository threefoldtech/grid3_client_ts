import { Expose, Transform } from "class-transformer";
import { IsBoolean, IsEnum, IsInt, IsNotEmpty, IsString, Min } from "class-validator";

import { WorkloadData, WorkloadDataResult } from "./workload_base";

enum ZdbModes {
    seq = "seq",
    user = "user",
}
class Zdb extends WorkloadData {
    @Expose() @IsInt() @Min(1) size: number; // in bytes
    @Expose() @Transform(({ value }) => ZdbModes[value]) @IsEnum(ZdbModes) mode: ZdbModes = ZdbModes.seq;
    @Expose() @IsString() @IsNotEmpty() password: string;
    @Expose() @IsBoolean() public: boolean;

    challenge(): string {
        let out = "";
        out += this.size;
        out += this.mode.toString();
        out += this.password;
        out += this.public.toString();

        return out;
    }
}

class ZdbResult extends WorkloadDataResult {
    @Expose() Namespace: string;
    @Expose() IPs: string[];
    @Expose() Port: number;
}

export { Zdb, ZdbResult, ZdbModes };
