var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Keyring } from "@polkadot/keyring";
import { stringToHex } from "@polkadot/util";
import { Expose, Transform, Type } from "class-transformer";
import { IsBoolean, IsDefined, IsEnum, IsInt, IsNotEmpty, IsString, Min, ValidateNested } from "class-validator";
import { default as md5 } from "crypto-js/md5";
import { KeypairType } from "../clients//tf-grid/client";
import { Workload } from "./workload";
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
    Min(1),
    __metadata("design:type", Number)
], SignatureRequest.prototype, "twin_id", void 0);
__decorate([
    Expose(),
    IsBoolean(),
    __metadata("design:type", Boolean)
], SignatureRequest.prototype, "required", void 0);
__decorate([
    Expose(),
    IsInt(),
    Min(1),
    __metadata("design:type", Number)
], SignatureRequest.prototype, "weight", void 0);
class Signature {
}
__decorate([
    Expose(),
    IsInt(),
    Min(1),
    __metadata("design:type", Number)
], Signature.prototype, "twin_id", void 0);
__decorate([
    Expose(),
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], Signature.prototype, "signature", void 0);
__decorate([
    Expose(),
    Transform(({ value }) => KeypairType[value]),
    IsEnum(KeypairType),
    __metadata("design:type", String)
], Signature.prototype, "signature_type", void 0);
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
    ValidateNested({ each: true }),
    __metadata("design:type", Array)
], SignatureRequirement.prototype, "requests", void 0);
__decorate([
    Expose(),
    IsInt(),
    Min(1),
    __metadata("design:type", Number)
], SignatureRequirement.prototype, "weight_required", void 0);
__decorate([
    Expose(),
    Type(() => Signature),
    ValidateNested({ each: true }),
    __metadata("design:type", Array)
], SignatureRequirement.prototype, "signatures", void 0);
class Deployment {
    challenge() {
        let out = "";
        out += this.version;
        out += this.twin_id;
        out += this.metadata;
        out += this.description;
        out += this.expiration;
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
    sign(twin_id, mnemonic, keypairType, hash = "", signer = null) {
        return __awaiter(this, void 0, void 0, function* () {
            const message = hash || this.challenge_hash();
            const message_bytes = this.from_hex(message);
            let hex_signed_msg;
            if (signer) {
                console.log("signing with the extension");
                console.log("address:", signer.address);
                console.log("signer:", signer.signer);
                const signature = yield signer.signer.signRaw({
                    address: signer.address,
                    data: stringToHex(message),
                    type: "bytes",
                });
                hex_signed_msg = signature.signature.slice(2);
            }
            else {
                const keyr = new Keyring({ type: keypairType });
                const key = keyr.addFromMnemonic(mnemonic);
                const signed_msg = key.sign(message_bytes);
                hex_signed_msg = this.to_hex(signed_msg);
            }
            for (let i = 0; i < this.signature_requirement.signatures.length; i++) {
                if (this.signature_requirement.signatures[i].twin_id === twin_id) {
                    this.signature_requirement.signatures[i].signature = hex_signed_msg;
                    this.signature_requirement.signatures[i].signature_type = keypairType;
                }
            }
            const signature = new Signature();
            signature.twin_id = twin_id;
            signature.signature = hex_signed_msg;
            signature.signature_type = keypairType;
            this.signature_requirement.signatures.push(signature);
        });
    }
}
__decorate([
    Expose(),
    IsInt(),
    Min(0),
    __metadata("design:type", Number)
], Deployment.prototype, "version", void 0);
__decorate([
    Expose(),
    IsInt(),
    Min(1),
    __metadata("design:type", Number)
], Deployment.prototype, "twin_id", void 0);
__decorate([
    Expose(),
    __metadata("design:type", Number)
], Deployment.prototype, "contract_id", void 0);
__decorate([
    Expose(),
    IsInt(),
    __metadata("design:type", Number)
], Deployment.prototype, "expiration", void 0);
__decorate([
    Expose(),
    IsString(),
    IsDefined(),
    __metadata("design:type", Object)
], Deployment.prototype, "metadata", void 0);
__decorate([
    Expose(),
    IsString(),
    IsDefined(),
    __metadata("design:type", Object)
], Deployment.prototype, "description", void 0);
__decorate([
    Expose(),
    Type(() => Workload),
    ValidateNested({ each: true }),
    __metadata("design:type", Array)
], Deployment.prototype, "workloads", void 0);
__decorate([
    Expose(),
    Type(() => SignatureRequirement),
    ValidateNested(),
    __metadata("design:type", SignatureRequirement)
], Deployment.prototype, "signature_requirement", void 0);
export { Deployment, SignatureRequirement, SignatureRequest, Signature };
