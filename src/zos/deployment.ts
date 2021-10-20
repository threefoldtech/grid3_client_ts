import { IsString, IsNotEmpty, IsBoolean, IsDefined, IsInt, Min, ValidateNested } from "class-validator";
import { Expose, Type } from "class-transformer";

import { Workload } from "./workload";

import { default as md5 } from "crypto-js/md5";
import { Keyring } from "@polkadot/keyring";

class SignatureRequest {
    @Expose() @IsInt() @Min(1) twin_id: number;
    @Expose() @IsBoolean() required: boolean;
    @Expose() @IsInt() @Min(1) weight: number;

    challenge() {
        let out = "";
        out += this.twin_id;
        out += this.required;
        out += this.weight;

        return out;
    }
}


class Signature {
    @Expose() @IsInt() @Min(1) twin_id: number;
    @Expose() @IsString() @IsNotEmpty() signature: string;
}

class SignatureRequirement {
    @Expose() @Type(() => SignatureRequest) @ValidateNested({ each: true }) requests: SignatureRequest[] = [];
    @Expose() @IsInt() @Min(1) weight_required: number;
    @Expose() @Type(() => Signature) @ValidateNested({ each: true }) signatures: Signature[] = [];

    challenge() {
        let out = "";

        for (let i = 0; i < this.requests.length; i++) {
            out += this.requests[i].challenge();
        }

        out += this.weight_required;
        return out;
    }
}

class Deployment {
    @Expose() @IsInt() @Min(0) version: number;
    @Expose() @IsInt() @Min(1) twin_id: number;
    @Expose() @IsInt() @Min(1) contract_id: number;
    @Expose() @IsInt() expiration: number;
    @Expose() @IsString() @IsDefined() metadata;
    @Expose() @IsString() @IsDefined() description;

    @Expose() @Type(() => Workload) @ValidateNested({ each: true }) workloads: Workload[];

    @Expose() @Type(() => SignatureRequirement) @ValidateNested() signature_requirement: SignatureRequirement;

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

export { Deployment, SignatureRequirement, SignatureRequest };
