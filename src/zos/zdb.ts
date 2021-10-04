enum ZdbModes {
    seq = "seq",
    user = "user",
}

enum DeviceTypes {
    hdd = "hdd",
    ssd = "ssd",
}

class Zdb {
    namespace = "";
    // size in bytes
    size: number;
    mode: ZdbModes = ZdbModes.seq;
    password = "";
    disk_type: DeviceTypes = DeviceTypes.hdd;
    public = false;

    challenge() {
        let out = "";
        out += this.size || "";
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
