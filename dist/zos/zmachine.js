"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZmachineResult = exports.Mount = exports.ZNetworkInterface = exports.ZmachineNetwork = exports.Zmachine = void 0;
class ZNetworkInterface {
    network = "";
    ip = "";
}
exports.ZNetworkInterface = ZNetworkInterface;
class ZmachineNetwork {
    public_ip = "";
    interfaces = [];
    planetary = false;
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
exports.ZmachineNetwork = ZmachineNetwork;
class Mount {
    name = "";
    mountpoint = "";
    challenge() {
        let out = "";
        out += this.name;
        out += this.mountpoint;
        return out;
    }
}
exports.Mount = Mount;
class Zmachine {
    flist = ""; // if full url means custom flist meant for containers, if just name should be an official vm
    network;
    size;
    compute_capacity;
    mounts = [];
    entrypoint = ""; //how to invoke that in a vm?
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
exports.Zmachine = Zmachine;
// response of the deployment
class ZmachineResult {
    // name unique per deployment, re-used in request & response
    id = "";
    ip = "";
}
exports.ZmachineResult = ZmachineResult;
