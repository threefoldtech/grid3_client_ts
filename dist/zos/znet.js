"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Peer = exports.Znet = void 0;
// is a remote wireguard client which can connect to this node
class Peer {
    // is another class C in same class B as above
    subnet = "";
    // wireguard public key, curve25519
    wireguard_public_key = "";
    allowed_ips = [];
    // ipv4 or ipv6
    // can be empty, one of the 2 need to be filled in though
    endpoint = "";
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
exports.Peer = Peer;
// wg network reservation (znet)
class Znet {
    // unique nr for each network chosen, this identified private networks as connected to a container or vm or ...
    // corresponds to the 2nd number of a class B ipv4 address
    // is a class C of a chosen class B
    // form: e.g. 192.168.16.0/24
    // needs to be a private subnet
    subnet = "";
    ip_range = "";
    // wireguard private key, curve25519
    wireguard_private_key = "";
    //>1024?
    wireguard_listen_port;
    peers = [];
    challenge() {
        let out = "";
        out += this.ip_range;
        out += this.subnet;
        out += this.wireguard_private_key;
        out += this.wireguard_listen_port || "";
        for (let i = 0; i < this.peers.length; i++) {
            out += this.peers[i].challenge();
        }
        return out;
    }
}
exports.Znet = Znet;
