"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicIPResult = exports.PublicIP = void 0;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const workload_base_1 = require("./workload_base");
class PublicIP extends workload_base_1.WorkloadData {
    v4;
    v6;
    challenge() {
        return this.v4.toString() + this.v6.toString();
    }
}
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], PublicIP.prototype, "v4", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], PublicIP.prototype, "v6", void 0);
exports.PublicIP = PublicIP;
class PublicIPResult extends workload_base_1.WorkloadDataResult {
    ip;
    ip6;
    gateway;
}
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], PublicIPResult.prototype, "ip", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], PublicIPResult.prototype, "ip6", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], PublicIPResult.prototype, "gateway", void 0);
exports.PublicIPResult = PublicIPResult;
