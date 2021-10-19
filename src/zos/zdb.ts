import { IsBoolean, IsString, IsNotEmpty, IsInt, Min } from "class-validator";

enum ZdbModes {
    seq = "seq",
    user = "user",
}

enum DeviceTypes {
    hdd = "hdd",
    ssd = "ssd",
}

class Zdb {
    @IsString() @IsNotEmpty() namespace: string;
    // size in bytes
    @IsInt() @Min(1) size: number;
    mode: ZdbModes = ZdbModes.seq;
    @IsString() @IsNotEmpty() password: string;
    disk_type: DeviceTypes = DeviceTypes.hdd;
    @IsBoolean() public: boolean;

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
