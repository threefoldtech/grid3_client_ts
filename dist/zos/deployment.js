"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignatureRequest = exports.SignatureRequirement = exports.Deployment = void 0;
var md5 = require('crypto-js/md5');
const keyring = require('@polkadot/keyring');
class SignatureRequest {
    constructor() {
        // if put on required then this twin_id needs to sign
        this.required = false;
    }
    challenge() {
        let out = "";
        out += this.twin_id || "";
        out += this.required;
        out += this.weight || "";
        return out;
    }
}
exports.SignatureRequest = SignatureRequest;
// Challenge computes challenge for SignatureRequest
class Signature {
    constructor() {
        // signature (done with private key of the twin_id)
        this.signature = "";
    }
}
class SignatureRequirement {
    constructor() {
        // the requests which can allow to get to required quorum
        this.requests = [];
        this.signatures = [];
    }
    // Challenge computes challenge for SignatureRequest
    challenge() {
        let out = "";
        for (let i = 0; i < this.requests.length; i++) {
            out += this.requests[i].challenge();
        }
        out += this.weight_required || "";
        return out;
    }
}
exports.SignatureRequirement = SignatureRequirement;
// deployment is given to each Zero-OS who needs to deploy something
// the zero-os'es will only take out what is relevant for them
// if signature not done on the main Deployment one, nothing will happen
class Deployment {
    constructor() {
        this.metadata = "";
        this.description = "";
    }
    challenge() {
        let out = "";
        out += this.version;
        out += this.twin_id || "";
        out += this.metadata;
        out += this.description;
        out += this.expiration || "";
        for (let i = 0; i < this.workloads.length; i++) {
            out += this.workloads[i].challenge();
        }
        out += this.signature_requirement.challenge();
        return out;
    }
    // ChallengeHash computes the hash of the challenge signed
    // by the user. used for validation
    challenge_hash() {
        return md5(this.challenge()).toString();
    }
    from_hex(s) {
        var result = new Uint8Array(s.length / 2);
        for (var i = 0; i < s.length / 2; i++) {
            result[i] = parseInt(s.substr(2 * i, 2), 16);
        }
        return result;
    }
    to_hex(bs) {
        var encoded = [];
        for (var i = 0; i < bs.length; i++) {
            encoded.push("0123456789abcdef"[(bs[i] >> 4) & 15]);
            encoded.push("0123456789abcdef"[bs[i] & 15]);
        }
        return encoded.join('');
    }
    sign(twin_id, mnemonic) {
        let message = this.challenge_hash();
        let message_bytes = this.from_hex(message);
        let keyr = new keyring.Keyring({ type: 'ed25519' });
        let key = keyr.addFromMnemonic(mnemonic);
        let signed_msg = key.sign(message_bytes);
        let hex_signed_msg = this.to_hex(signed_msg);
        for (let i = 0; i < this.signature_requirement.signatures.length; i++) {
            if (this.signature_requirement.signatures[i].twin_id === twin_id) {
                this.signature_requirement.signatures[i].signature = hex_signed_msg;
            }
        }
        let signature = new Signature();
        signature.twin_id = twin_id;
        signature.signature = hex_signed_msg;
        this.signature_requirement.signatures.push(signature);
    }
}
exports.Deployment = Deployment;
