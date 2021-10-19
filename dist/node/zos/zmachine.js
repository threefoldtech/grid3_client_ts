"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZmachineResult = exports.Mount = exports.ZNetworkInterface = exports.ZmachineNetwork = exports.Zmachine = void 0;
const class_validator_1 = require("class-validator");
class ZNetworkInterface {
    network;
    ip;
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)()
], ZNetworkInterface.prototype, "network", void 0);
__decorate([
    (0, class_validator_1.IsIP)(),
    (0, class_validator_1.IsNotEmpty)()
], ZNetworkInterface.prototype, "ip", void 0);
exports.ZNetworkInterface = ZNetworkInterface;
class ZmachineNetwork {
    public_ip;
    interfaces;
    planetary;
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
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)()
], ZmachineNetwork.prototype, "public_ip", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)({ each: true })
], ZmachineNetwork.prototype, "interfaces", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)()
], ZmachineNetwork.prototype, "planetary", void 0);
exports.ZmachineNetwork = ZmachineNetwork;
class Mount {
    name;
    mountpoint;
    challenge() {
        let out = "";
        out += this.name;
        out += this.mountpoint;
        return out;
    }
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)()
], Mount.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)()
], Mount.prototype, "mountpoint", void 0);
exports.Mount = Mount;
class Zmachine {
    flist; // if full url means custom flist meant for containers, if just name should be an official vm
    network;
    size;
    compute_capacity;
    mounts;
    entrypoint; //how to invoke that in a vm?
    env; //environment for the zmachine
    challenge() {
        let out = "";
        out += this.flist;
        out += this.network.challenge();
        out += this.size || "";
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
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)()
], Zmachine.prototype, "flist", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)()
], Zmachine.prototype, "network", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1024 * 1024 * 250)
], Zmachine.prototype, "size", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)()
], Zmachine.prototype, "compute_capacity", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)({ each: true })
], Zmachine.prototype, "mounts", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)()
], Zmachine.prototype, "entrypoint", void 0);
exports.Zmachine = Zmachine;
// response of the deployment
class ZmachineResult {
    // name unique per deployment, re-used in request & response
    id = "";
    ip = "";
}
exports.ZmachineResult = ZmachineResult;
