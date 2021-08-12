"use strict";
exports.__esModule = true;
exports.ZmachineResult = exports.Mount = exports.ZNetworkInterface = exports.ZmachineNetwork = exports.Zmachine = void 0;
var ZNetworkInterface = /** @class */ (function () {
    function ZNetworkInterface() {
        this.network = "";
        this.ip = "";
    }
    return ZNetworkInterface;
}());
exports.ZNetworkInterface = ZNetworkInterface;
var ZmachineNetwork = /** @class */ (function () {
    function ZmachineNetwork() {
        this.public_ip = "";
        this.interfaces = [];
        this.planetary = false;
    }
    ZmachineNetwork.prototype.challenge = function () {
        var out = "";
        out += this.public_ip;
        out += this.planetary.toString();
        for (var i = 0; i < this.interfaces.length; i++) {
            out += this.interfaces[i].network;
            out += this.interfaces[i].ip;
        }
        return out;
    };
    return ZmachineNetwork;
}());
exports.ZmachineNetwork = ZmachineNetwork;
var Mount = /** @class */ (function () {
    function Mount() {
        this.name = "";
        this.mountpoint = "";
    }
    Mount.prototype.challenge = function () {
        var out = "";
        out += this.name;
        out += this.mountpoint;
        return out;
    };
    return Mount;
}());
exports.Mount = Mount;
var Zmachine = /** @class */ (function () {
    function Zmachine() {
        this.flist = ""; // if full url means custom flist meant for containers, if just name should be an official vm
        this.mounts = [];
        this.entrypoint = ""; //how to invoke that in a vm?
    }
    Zmachine.prototype.challenge = function () {
        var out = "";
        out += this.flist;
        out += this.network.challenge();
        out += this.size || "";
        out += this.compute_capacity.challenge();
        for (var i = 0; i < this.mounts.length; i++) {
            out += this.mounts[i].challenge();
        }
        out += this.entrypoint;
        for (var _i = 0, _a = Object.keys(this.env).sort(); _i < _a.length; _i++) {
            var key = _a[_i];
            out += key;
            out += "=";
            out += this.env[key];
        }
        return out;
    };
    return Zmachine;
}());
exports.Zmachine = Zmachine;
// response of the deployment
var ZmachineResult = /** @class */ (function () {
    function ZmachineResult() {
        // name unique per deployment, re-used in request & response
        this.id = "";
        this.ip = "";
    }
    return ZmachineResult;
}());
exports.ZmachineResult = ZmachineResult;
