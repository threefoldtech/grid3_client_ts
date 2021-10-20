var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { IsBoolean, IsString, IsNotEmpty, IsInt, Min, IsEnum } from "class-validator";
import { Expose, Transform } from "class-transformer";
import { WorkloadData, WorkloadDataResult } from "./workload_base";
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
class Zdb extends WorkloadData {
    constructor() {
        super(...arguments);
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
    Expose(),
    IsString(),
    IsNotEmpty()
], Zdb.prototype, "namespace", void 0);
__decorate([
    Expose(),
    IsInt(),
    Min(1)
], Zdb.prototype, "size", void 0);
__decorate([
    Expose(),
    Transform(({ value }) => ZdbModes[value]),
    IsEnum(ZdbModes)
], Zdb.prototype, "mode", void 0);
__decorate([
    Expose(),
    IsString(),
    IsNotEmpty()
], Zdb.prototype, "password", void 0);
__decorate([
    Expose(),
    Transform(({ value }) => DeviceTypes[value]),
    IsEnum(DeviceTypes)
], Zdb.prototype, "disk_type", void 0);
__decorate([
    Expose(),
    IsBoolean()
], Zdb.prototype, "public", void 0);
class ZdbResult extends WorkloadDataResult {
}
__decorate([
    Expose()
], ZdbResult.prototype, "namespace", void 0);
__decorate([
    Expose()
], ZdbResult.prototype, "ips", void 0);
__decorate([
    Expose()
], ZdbResult.prototype, "port", void 0);
export { Zdb, ZdbResult, ZdbModes, DeviceTypes };
