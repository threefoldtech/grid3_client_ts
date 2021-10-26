"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZmountResult = exports.Zmount = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const workload_base_1 = require("./workload_base");
class Zmount extends workload_base_1.WorkloadData {
    size; // in bytes
    challenge() {
        return this.size.toString();
    }
}
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1)
], Zmount.prototype, "size", void 0);
exports.Zmount = Zmount;
class ZmountResult extends workload_base_1.WorkloadDataResult {
    volume_id;
}
__decorate([
    (0, class_transformer_1.Expose)()
], ZmountResult.prototype, "volume_id", void 0);
exports.ZmountResult = ZmountResult;
