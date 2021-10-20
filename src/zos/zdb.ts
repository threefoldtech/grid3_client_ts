import { IsBoolean, IsString, IsNotEmpty, IsInt, Min, IsEnum } from "class-validator";
import { Expose, Transform } from "class-transformer";

import { WorkloadBaseData } from "./workload_base";


enum ZdbModes {
    seq = "seq",
    user = "user",
}

enum DeviceTypes {
    hdd = "hdd",
    ssd = "ssd",
}

class Zdb extends WorkloadBaseData {
    @Expose() @IsString() @IsNotEmpty() namespace: string;
    @Expose() @IsInt() @Min(1) size: number; // in bytes
    @Expose() @Transform(({ value }) => ZdbModes[value]) @IsEnum(ZdbModes) mode: ZdbModes = ZdbModes.seq;
    @Expose() @IsString() @IsNotEmpty() password: string;
    @Expose() @Transform(({ value }) => DeviceTypes[value]) @IsEnum(DeviceTypes) disk_type: DeviceTypes = DeviceTypes.hdd;
    @Expose() @IsBoolean() public: boolean;

    challenge() {
        let out = "";
        out += this.size;
        out += this.mode.toString();
        out += this.password;
        out += this.public.toString();

        return out;
    }
}

class ZdbResult {
    name = "";
    namespace = "";
    ips: string[];
    port = 0;
}

export { Zdb, ZdbResult, ZdbModes, DeviceTypes };
