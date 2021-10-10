class ZNetworkInterface {
    constructor() {
        this.network = "";
        this.ip = "";
    }
}
class ZmachineNetwork {
    constructor() {
        this.public_ip = "";
        this.interfaces = [];
        this.planetary = false;
    }
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
class Mount {
    constructor() {
        this.name = "";
        this.mountpoint = "";
    }
    challenge() {
        let out = "";
        out += this.name;
        out += this.mountpoint;
        return out;
    }
}
class Zmachine {
    constructor() {
        this.flist = ""; // if full url means custom flist meant for containers, if just name should be an official vm
        this.mounts = [];
        this.entrypoint = ""; //how to invoke that in a vm?
    }
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
// response of the deployment
class ZmachineResult {
    constructor() {
        // name unique per deployment, re-used in request & response
        this.id = "";
        this.ip = "";
    }
}
export { Zmachine, ZmachineNetwork, ZNetworkInterface, Mount, ZmachineResult };