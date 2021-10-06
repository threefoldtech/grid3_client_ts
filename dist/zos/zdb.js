var ZdbModes;
(function (ZdbModes) {
    ZdbModes["seq"] = "seq";
    ZdbModes["user"] = "user";
})(ZdbModes || (ZdbModes = {}));
var DeviceTypes;
(function (DeviceTypes) {
    DeviceTypes["hdd"] = "hdd";
    DeviceTypes["ssd"] = "ssd";
})(DeviceTypes || (DeviceTypes = {}));
class Zdb {
    constructor() {
        this.namespace = "";
        this.mode = ZdbModes.seq;
        this.password = "";
        this.disk_type = DeviceTypes.hdd;
        this.public = false;
    }
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
    constructor() {
        this.name = "";
        this.namespace = "";
        this.port = 0;
    }
}
export { Zdb, ZdbResult, ZdbModes, DeviceTypes };
