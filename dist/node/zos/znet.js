"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZnetResult = exports.Peer = exports.Znet = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const workload_base_1 = require("./workload_base");
class Peer {
    subnet;
    wireguard_public_key;
    allowed_ips;
    endpoint;
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
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)()
], Peer.prototype, "subnet", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)()
], Peer.prototype, "wireguard_public_key", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.ArrayNotEmpty)()
], Peer.prototype, "allowed_ips", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsDefined)()
], Peer.prototype, "endpoint", void 0);
exports.Peer = Peer;
class Znet extends workload_base_1.WorkloadData {
    subnet;
    ip_range;
    wireguard_private_key;
    wireguard_listen_port;
    peers;
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
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)()
], Znet.prototype, "subnet", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)()
], Znet.prototype, "ip_range", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)()
], Znet.prototype, "wireguard_private_key", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsPort)(),
    (0, class_validator_1.IsNotEmpty)()
], Znet.prototype, "wireguard_listen_port", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_transformer_1.Type)(() => Peer),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_validator_1.ArrayNotEmpty)()
], Znet.prototype, "peers", void 0);
exports.Znet = Znet;
class ZnetResult extends workload_base_1.WorkloadDataResult {
}
exports.ZnetResult = ZnetResult;
