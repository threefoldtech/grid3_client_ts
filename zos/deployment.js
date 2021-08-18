"use strict";
exports.__esModule = true;
exports.SignatureRequest = exports.SignatureRequirement = exports.Deployment = void 0;
var md5 = require('crypto-js/md5');
var keyring = require('@polkadot/keyring');
var SignatureRequest = /** @class */ (function () {
    function SignatureRequest() {
        // if put on required then this twin_id needs to sign
        this.required = false;
    }
    SignatureRequest.prototype.challenge = function () {
        var out = "";
        out += this.twin_id || "";
        out += this.required;
        out += this.weight || "";
        return out;
    };
    return SignatureRequest;
}());
exports.SignatureRequest = SignatureRequest;
// Challenge computes challenge for SignatureRequest
var Signature = /** @class */ (function () {
    function Signature() {
        // signature (done with private key of the twin_id)
        this.signature = "";
    }
    return Signature;
}());
var SignatureRequirement = /** @class */ (function () {
    function SignatureRequirement() {
        // the requests which can allow to get to required quorum
        this.requests = [];
        this.signatures = [];
    }
    // Challenge computes challenge for SignatureRequest
    SignatureRequirement.prototype.challenge = function () {
        var out = "";
        for (var i = 0; i < this.requests.length; i++) {
            out += this.requests[i].challenge();
        }
        out += this.weight_required || "";
        return out;
    };
    return SignatureRequirement;
}());
exports.SignatureRequirement = SignatureRequirement;
// deployment is given to each Zero-OS who needs to deploy something
// the zero-os'es will only take out what is relevant for them
// if signature not done on the main Deployment one, nothing will happen
var Deployment = /** @class */ (function () {
    function Deployment() {
        this.metadata = "";
        this.description = "";
    }
    Deployment.prototype.challenge = function () {
        var out = "";
        out += this.version;
        out += this.twin_id || "";
        out += this.metadata;
        out += this.description;
        out += this.expiration || "";
        for (var i = 0; i < this.workloads.length; i++) {
            out += this.workloads[i].challenge();
        }
        out += this.signature_requirement.challenge();
        return out;
    };
    // ChallengeHash computes the hash of the challenge signed
    // by the user. used for validation
    Deployment.prototype.challenge_hash = function () {
        return md5(this.challenge()).toString();
    };
    Deployment.prototype.from_hex = function (s) {
        var result = new Uint8Array(s.length / 2);
        for (var i = 0; i < s.length / 2; i++) {
            result[i] = parseInt(s.substr(2 * i, 2), 16);
        }
        return result;
    };
    Deployment.prototype.to_hex = function (bs) {
        var encoded = [];
        for (var i = 0; i < bs.length; i++) {
            encoded.push("0123456789abcdef"[(bs[i] >> 4) & 15]);
            encoded.push("0123456789abcdef"[bs[i] & 15]);
        }
        return encoded.join('');
    };
    Deployment.prototype.sign = function (twin_id, mnemonic) {
        var message = this.challenge_hash();
        var message_bytes = this.from_hex(message);
        var keyr = new keyring.Keyring({ type: 'ed25519' });
        var key = keyr.addFromMnemonic(mnemonic);
        var signed_msg = key.sign(message_bytes);
        var hex_signed_msg = this.to_hex(signed_msg);
        for (var i = 0; i < this.signature_requirement.signatures.length; i++) {
            if (this.signature_requirement.signatures[i].twin_id === twin_id) {
                this.signature_requirement.signatures[i].signature = hex_signed_msg;
            }
        }
        var signature = new Signature();
        signature.twin_id = twin_id;
        signature.signature = hex_signed_msg;
        this.signature_requirement.signatures.push(signature);
    };
    return Deployment;
}());
exports.Deployment = Deployment;
