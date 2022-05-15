var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Expose, Transform, Type } from "class-transformer";
import { IsBoolean, IsDefined, IsInt, IsIP, IsNotEmpty, IsString, Max, ValidateNested } from "class-validator";
import { ComputeCapacity } from "./computecapacity";
import { WorkloadData, WorkloadDataResult } from "./workload_base";
class ZNetworkInterface {
}
__decorate([
    Expose(),
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], ZNetworkInterface.prototype, "network", void 0);
__decorate([
    Expose(),
    IsIP(),
    IsNotEmpty(),
    __metadata("design:type", String)
], ZNetworkInterface.prototype, "ip", void 0);
class ZmachineNetwork {
    challenge() {
        let out = "";
        out += this.public_ip;
        out += this.planetary.toString();
        for (let i = 0; i < this.interfaces.length; i++) {
            out += this.interfaces[i].network;
            out += this.interfaces[i].ip;
        }
        return out;
    }
}
__decorate([
    Expose(),
    IsString(),
    IsDefined(),
    __metadata("design:type", String)
], ZmachineNetwork.prototype, "public_ip", void 0);
__decorate([
    Expose(),
    Type(() => ZNetworkInterface),
    ValidateNested({ each: true }),
    __metadata("design:type", Array)
], ZmachineNetwork.prototype, "interfaces", void 0);
__decorate([
    Expose(),
    IsBoolean(),
    __metadata("design:type", Boolean)
], ZmachineNetwork.prototype, "planetary", void 0);
class Mount {
    challenge() {
        let out = "";
        out += this.name;
        out += this.mountpoint;
        return out;
    }
}
__decorate([
    Expose(),
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], Mount.prototype, "name", void 0);
__decorate([
    Expose(),
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], Mount.prototype, "mountpoint", void 0);
class Zmachine extends WorkloadData {
    challenge() {
        let out = "";
        out += this.flist;
        out += this.network.challenge();
        out += this.size || "0";
        out += this.compute_capacity.challenge();
        for (let i = 0; i < this.mounts.length; i++) {
            out += this.mounts[i].challenge();
        }
        out += this.entrypoint;
        for (const key of Object.keys(this.env).sort()) {
            out += key;
            out += "=";
            out += this.env[key];
        }
        return out;
    }
}
__decorate([
    Expose(),
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], Zmachine.prototype, "flist", void 0);
__decorate([
    Expose(),
    Type(() => ZmachineNetwork),
    ValidateNested(),
    __metadata("design:type", ZmachineNetwork)
], Zmachine.prototype, "network", void 0);
__decorate([
    Expose(),
    IsInt(),
    Max(10 * Math.pow(1024, 4)),
    __metadata("design:type", Number)
], Zmachine.prototype, "size", void 0);
__decorate([
    Expose(),
    Type(() => ComputeCapacity),
    ValidateNested(),
    __metadata("design:type", ComputeCapacity)
], Zmachine.prototype, "compute_capacity", void 0);
__decorate([
    Expose(),
    Type(() => Mount),
    ValidateNested({ each: true }),
    __metadata("design:type", Array)
], Zmachine.prototype, "mounts", void 0);
__decorate([
    Expose(),
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], Zmachine.prototype, "entrypoint", void 0);
__decorate([
    Expose(),
    __metadata("design:type", Object)
], Zmachine.prototype, "env", void 0);
__decorate([
    Expose(),
    Transform(({ value }) => (value ? true : false)),
    IsBoolean(),
    __metadata("design:type", Boolean)
], Zmachine.prototype, "corex", void 0);
class ZmachineResult extends WorkloadDataResult {
}
__decorate([
    Expose(),
    __metadata("design:type", String)
], ZmachineResult.prototype, "id", void 0);
__decorate([
    Expose(),
    __metadata("design:type", String)
], ZmachineResult.prototype, "ip", void 0);
__decorate([
    Expose(),
    __metadata("design:type", String)
], ZmachineResult.prototype, "ygg_ip", void 0);
export { Zmachine, ZmachineNetwork, ZNetworkInterface, Mount, ZmachineResult };
