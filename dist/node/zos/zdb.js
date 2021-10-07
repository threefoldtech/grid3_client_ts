"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeviceTypes = exports.ZdbModes = exports.ZdbResult = exports.Zdb = void 0;
var ZdbModes;
(function (ZdbModes) {
    ZdbModes["seq"] = "seq";
    ZdbModes["user"] = "user";
})(ZdbModes || (ZdbModes = {}));
exports.ZdbModes = ZdbModes;
var DeviceTypes;
(function (DeviceTypes) {
    DeviceTypes["hdd"] = "hdd";
    DeviceTypes["ssd"] = "ssd";
})(DeviceTypes || (DeviceTypes = {}));
exports.DeviceTypes = DeviceTypes;
class Zdb {
    namespace = "";
    // size in bytes
    size;
    mode = ZdbModes.seq;
    password = "";
    disk_type = DeviceTypes.hdd;
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
exports.Zdb = Zdb;
class ZdbResult {
    name = "";
    namespace = "";
    ips;
    port = 0;
}
exports.ZdbResult = ZdbResult;
