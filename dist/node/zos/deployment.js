"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Signature = exports.SignatureRequest = exports.SignatureRequirement = exports.Deployment = void 0;
const keyring_1 = require("@polkadot/keyring");
const util_1 = require("@polkadot/util");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const md5_1 = __importDefault(require("crypto-js/md5"));
const client_1 = require("../clients//tf-grid/client");
const workload_1 = require("./workload");
class SignatureRequest {
    twin_id;
    required;
    weight;
    challenge() {
        let out = "";
        out += this.twin_id;
        out += this.required;
        out += this.weight;
        return out;
    }
}
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], SignatureRequest.prototype, "twin_id", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], SignatureRequest.prototype, "required", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], SignatureRequest.prototype, "weight", void 0);
exports.SignatureRequest = SignatureRequest;
class Signature {
    twin_id;
    signature;
    signature_type;
}
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], Signature.prototype, "twin_id", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], Signature.prototype, "signature", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_transformer_1.Transform)(({ value }) => client_1.KeypairType[value]),
    (0, class_validator_1.IsEnum)(client_1.KeypairType),
    __metadata("design:type", String)
], Signature.prototype, "signature_type", void 0);
exports.Signature = Signature;
class SignatureRequirement {
    requests = [];
    weight_required;
    signatures = [];
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
    (0, class_transformer_1.Expose)(),
    (0, class_transformer_1.Type)(() => SignatureRequest),
    (0, class_validator_1.ValidateNested)({ each: true }),
    __metadata("design:type", Array)
], SignatureRequirement.prototype, "requests", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], SignatureRequirement.prototype, "weight_required", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_transformer_1.Type)(() => Signature),
    (0, class_validator_1.ValidateNested)({ each: true }),
    __metadata("design:type", Array)
], SignatureRequirement.prototype, "signatures", void 0);
exports.SignatureRequirement = SignatureRequirement;
class Deployment {
    version;
    twin_id;
    contract_id;
    expiration;
    metadata;
    description;
    workloads;
    signature_requirement;
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
        return (0, md5_1.default)(this.challenge()).toString();
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
    async sign(twin_id, mnemonic, keypairType, hash = "", signer = null) {
        const message = hash || this.challenge_hash();
        const message_bytes = this.from_hex(message);
        let hex_signed_msg;
        if (signer) {
            console.log("signing with the extension");
            console.log("address:", signer.address);
            console.log("signer:", signer.signer);
            const signature = await signer.signer.signRaw({
                address: signer.address,
                data: (0, util_1.stringToHex)(message),
                type: "bytes",
            });
            hex_signed_msg = signature.signature.slice(2);
        }
        else {
            const keyr = new keyring_1.Keyring({ type: keypairType });
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
    }
}
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], Deployment.prototype, "version", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], Deployment.prototype, "twin_id", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], Deployment.prototype, "contract_id", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], Deployment.prototype, "expiration", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsDefined)(),
    __metadata("design:type", Object)
], Deployment.prototype, "metadata", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsDefined)(),
    __metadata("design:type", Object)
], Deployment.prototype, "description", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_transformer_1.Type)(() => workload_1.Workload),
    (0, class_validator_1.ValidateNested)({ each: true }),
    __metadata("design:type", Array)
], Deployment.prototype, "workloads", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_transformer_1.Type)(() => SignatureRequirement),
    (0, class_validator_1.ValidateNested)(),
    __metadata("design:type", SignatureRequirement)
], Deployment.prototype, "signature_requirement", void 0);
exports.Deployment = Deployment;
