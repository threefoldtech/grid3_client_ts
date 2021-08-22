"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZdbResult = exports.Zdb = void 0;
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
        out += this.disk_type.toString();
        out += this.public.toString();
        return out;
    }
}
exports.Zdb = Zdb;
class ZdbResult {
    constructor() {
        this.name = "";
        this.namespace = "";
        this.port = 0;
    }
}
exports.ZdbResult = ZdbResult;
