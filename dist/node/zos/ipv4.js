"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicIPResult = exports.PublicIP = void 0;
const class_transformer_1 = require("class-transformer");
const workload_base_1 = require("./workload_base");
class PublicIP extends workload_base_1.WorkloadData {
    challenge() {
        return "";
    }
}
exports.PublicIP = PublicIP;
class PublicIPResult extends workload_base_1.WorkloadDataResult {
    ip;
    gateway;
}
__decorate([
    (0, class_transformer_1.Expose)()
], PublicIPResult.prototype, "ip", void 0);
__decorate([
    (0, class_transformer_1.Expose)()
], PublicIPResult.prototype, "gateway", void 0);
exports.PublicIPResult = PublicIPResult;
