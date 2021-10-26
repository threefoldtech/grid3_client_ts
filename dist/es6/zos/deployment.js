var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { IsString, IsNotEmpty, IsBoolean, IsDefined, IsInt, Min, ValidateNested } from "class-validator";
import { Expose, Type } from "class-transformer";
import { Workload } from "./workload";
import { default as md5 } from "crypto-js/md5";
import { Keyring } from "@polkadot/keyring";
class SignatureRequest {
    challenge() {
        let out = "";
        out += this.twin_id;
        out += this.required;
        out += this.weight;
        return out;
    }
}
__decorate([
    Expose(),
    IsInt(),
    Min(1)
], SignatureRequest.prototype, "twin_id", void 0);
__decorate([
    Expose(),
    IsBoolean()
], SignatureRequest.prototype, "required", void 0);
__decorate([
    Expose(),
    IsInt(),
    Min(1)
], SignatureRequest.prototype, "weight", void 0);
class Signature {
}
__decorate([
    Expose(),
    IsInt(),
    Min(1)
], Signature.prototype, "twin_id", void 0);
__decorate([
    Expose(),
    IsString(),
    IsNotEmpty()
], Signature.prototype, "signature", void 0);
class SignatureRequirement {
    constructor() {
        this.requests = [];
        this.signatures = [];
    }
    challenge() {
        let out = "";
        for (let i = 0; i < this.requests.length; i++) {
            out += this.requests[i].challenge();
        }
        out += this.weight_required;
        return out;
    }
}
__decorate([
    Expose(),
    Type(() => SignatureRequest),
    ValidateNested({ each: true })
], SignatureRequirement.prototype, "requests", void 0);
__decorate([
    Expose(),
    IsInt(),
    Min(1)
], SignatureRequirement.prototype, "weight_required", void 0);
__decorate([
    Expose(),
    Type(() => Signature),
    ValidateNested({ each: true })
], SignatureRequirement.prototype, "signatures", void 0);
class Deployment {
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
    challenge_hash() {
        return md5(this.challenge()).toString();
    }
    from_hex(s) {
        const result = new Uint8Array(s.length / 2);
        for (let i = 0; i < s.length / 2; i++) {
            result[i] = parseInt(s.substr(2 * i, 2), 16);
        }
        return result;
    }
    to_hex(bs) {
        const encoded = [];
        for (let i = 0; i < bs.length; i++) {
            encoded.push("0123456789abcdef"[(bs[i] >> 4) & 15]);
            encoded.push("0123456789abcdef"[bs[i] & 15]);
        }
        return encoded.join("");
    }
    sign(twin_id, mnemonic, hash = "") {
        const message = hash || this.challenge_hash();
        const message_bytes = this.from_hex(message);
        const keyr = new Keyring({ type: "ed25519" });
        const key = keyr.addFromMnemonic(mnemonic);
        const signed_msg = key.sign(message_bytes);
        const hex_signed_msg = this.to_hex(signed_msg);
        for (let i = 0; i < this.signature_requirement.signatures.length; i++) {
            if (this.signature_requirement.signatures[i].twin_id === twin_id) {
                this.signature_requirement.signatures[i].signature = hex_signed_msg;
            }
        }
        const signature = new Signature();
        signature.twin_id = twin_id;
        signature.signature = hex_signed_msg;
        this.signature_requirement.signatures.push(signature);
    }
}
__decorate([
    Expose(),
    IsInt(),
    Min(0)
], Deployment.prototype, "version", void 0);
__decorate([
    Expose(),
    IsInt(),
    Min(1)
], Deployment.prototype, "twin_id", void 0);
__decorate([
    Expose()
], Deployment.prototype, "contract_id", void 0);
__decorate([
    Expose(),
    IsInt()
], Deployment.prototype, "expiration", void 0);
__decorate([
    Expose(),
    IsString(),
    IsDefined()
], Deployment.prototype, "metadata", void 0);
__decorate([
    Expose(),
    IsString(),
    IsDefined()
], Deployment.prototype, "description", void 0);
__decorate([
    Expose(),
    Type(() => Workload),
    ValidateNested({ each: true })
], Deployment.prototype, "workloads", void 0);
__decorate([
    Expose(),
    Type(() => SignatureRequirement),
    ValidateNested()
], Deployment.prototype, "signature_requirement", void 0);
export { Deployment, SignatureRequirement, SignatureRequest };
