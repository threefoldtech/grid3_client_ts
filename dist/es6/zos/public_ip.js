var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Expose } from "class-transformer";
import { IsBoolean } from "class-validator";
import { WorkloadData, WorkloadDataResult } from "./workload_base";
class PublicIP extends WorkloadData {
    challenge() {
        return this.v4.toString() + this.v6.toString();
    }
}
__decorate([
    Expose(),
    IsBoolean(),
    __metadata("design:type", Boolean)
], PublicIP.prototype, "v4", void 0);
__decorate([
    Expose(),
    IsBoolean(),
    __metadata("design:type", Boolean)
], PublicIP.prototype, "v6", void 0);
class PublicIPResult extends WorkloadDataResult {
}
__decorate([
    Expose(),
    __metadata("design:type", String)
], PublicIPResult.prototype, "ip", void 0);
__decorate([
    Expose(),
    __metadata("design:type", String)
], PublicIPResult.prototype, "ip6", void 0);
__decorate([
    Expose(),
    __metadata("design:type", String)
], PublicIPResult.prototype, "gateway", void 0);
export { PublicIP, PublicIPResult };
