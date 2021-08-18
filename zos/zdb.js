"use strict";
exports.__esModule = true;
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
var Zdb = /** @class */ (function () {
    function Zdb() {
        this.namespace = "";
        this.mode = ZdbModes.seq;
        this.password = "";
        this.disk_type = DeviceTypes.hdd;
        this.public = false;
    }
    Zdb.prototype.challenge = function () {
        var out = "";
        out += this.size || "";
        out += this.mode.toString();
        out += this.password;
        out += this.disk_type.toString();
        out += this.public.toString();
        return out;
    };
    return Zdb;
}());
exports.Zdb = Zdb;
var ZdbResult = /** @class */ (function () {
    function ZdbResult() {
        this.name = "";
        this.namespace = "";
        this.port = 0;
    }
    return ZdbResult;
}());
exports.ZdbResult = ZdbResult;
