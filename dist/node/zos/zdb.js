"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeviceTypes = exports.ZdbModes = exports.ZdbResult = exports.Zdb = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const workload_base_1 = require("./workload_base");
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
class Zdb extends workload_base_1.WorkloadBaseData {
    namespace;
    size; // in bytes
    mode = ZdbModes.seq;
    password;
    disk_type = DeviceTypes.hdd;
    public;
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
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)()
], Zdb.prototype, "namespace", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1)
], Zdb.prototype, "size", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_transformer_1.Transform)(({ value }) => ZdbModes[value]),
    (0, class_validator_1.IsEnum)(ZdbModes)
], Zdb.prototype, "mode", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)()
], Zdb.prototype, "password", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_transformer_1.Transform)(({ value }) => DeviceTypes[value]),
    (0, class_validator_1.IsEnum)(DeviceTypes)
], Zdb.prototype, "disk_type", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsBoolean)()
], Zdb.prototype, "public", void 0);
exports.Zdb = Zdb;
class ZdbResult {
    name = "";
    namespace = "";
    ips;
    port = 0;
}
exports.ZdbResult = ZdbResult;
