var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { IsBoolean, IsString, IsNotEmpty, IsInt, Min } from "class-validator";
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
        this.mode = ZdbModes.seq;
        this.disk_type = DeviceTypes.hdd;
    }
    challenge() {
        let out = "";
        out += this.size;
        out += this.mode.toString();
        out += this.password;
        out += this.public.toString();
        return out;
    }
}
__decorate([
    IsString(),
    IsNotEmpty()
], Zdb.prototype, "namespace", void 0);
__decorate([
    IsInt(),
    Min(1)
], Zdb.prototype, "size", void 0);
__decorate([
    IsString(),
    IsNotEmpty()
], Zdb.prototype, "password", void 0);
__decorate([
    IsBoolean()
], Zdb.prototype, "public", void 0);
class ZdbResult {
    constructor() {
        this.name = "";
        this.namespace = "";
        this.port = 0;
    }
}
export { Zdb, ZdbResult, ZdbModes, DeviceTypes };
