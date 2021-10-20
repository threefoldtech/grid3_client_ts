var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { IsInt, Min } from "class-validator";
import { Expose } from "class-transformer";
import { WorkloadData, WorkloadDataResult } from "./workload_base";
class Zmount extends WorkloadData {
    challenge() {
        return this.size;
    }
}
__decorate([
    Expose(),
    IsInt(),
    Min(1)
], Zmount.prototype, "size", void 0);
class ZmountResult extends WorkloadDataResult {
}
__decorate([
    Expose()
], ZmountResult.prototype, "volume_id", void 0);
export { Zmount, ZmountResult };
