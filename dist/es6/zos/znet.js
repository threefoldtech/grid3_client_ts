var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Expose, Type } from "class-transformer";
import { ArrayNotEmpty, IsDefined, IsInt, IsNotEmpty, IsString, ValidateNested } from "class-validator";
import { WorkloadData } from "./workload_base";
class Peer {
    challenge() {
        let out = "";
        out += this.wireguard_public_key;
        out += this.endpoint;
        out += this.subnet;
        for (let i = 0; i < this.allowed_ips.length; i++) {
            out += this.allowed_ips[i];
        }
        return out;
    }
}
__decorate([
    Expose(),
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], Peer.prototype, "subnet", void 0);
__decorate([
    Expose(),
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], Peer.prototype, "wireguard_public_key", void 0);
__decorate([
    Expose(),
    IsString({ each: true }),
    ArrayNotEmpty(),
    __metadata("design:type", Array)
], Peer.prototype, "allowed_ips", void 0);
__decorate([
    Expose(),
    IsString(),
    IsDefined(),
    __metadata("design:type", String)
], Peer.prototype, "endpoint", void 0);
class Znet extends WorkloadData {
    challenge() {
        let out = "";
        out += this.ip_range;
        out += this.subnet;
        out += this.wireguard_private_key;
        out += this.wireguard_listen_port;
        for (let i = 0; i < this.peers.length; i++) {
            out += this.peers[i].challenge();
        }
        return out;
    }
}
__decorate([
    Expose(),
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], Znet.prototype, "subnet", void 0);
__decorate([
    Expose(),
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], Znet.prototype, "ip_range", void 0);
__decorate([
    Expose(),
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], Znet.prototype, "wireguard_private_key", void 0);
__decorate([
    Expose(),
    IsInt(),
    IsNotEmpty(),
    __metadata("design:type", Number)
], Znet.prototype, "wireguard_listen_port", void 0);
__decorate([
    Expose(),
    Type(() => Peer),
    ValidateNested({ each: true }),
    __metadata("design:type", Array)
], Znet.prototype, "peers", void 0);
export { Znet, Peer };
