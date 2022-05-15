"use strict";
// TODO:---------Deprecated ------------------------------------//
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
exports.PublicIPv4Result = exports.PublicIPv4 = void 0;
const class_transformer_1 = require("class-transformer");
const workload_base_1 = require("./workload_base");
class PublicIPv4 extends workload_base_1.WorkloadData {
    challenge() {
        return "";
    }
}
exports.PublicIPv4 = PublicIPv4;
class PublicIPv4Result extends workload_base_1.WorkloadDataResult {
    ip;
    gateway;
}
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], PublicIPv4Result.prototype, "ip", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], PublicIPv4Result.prototype, "gateway", void 0);
exports.PublicIPv4Result = PublicIPv4Result;
