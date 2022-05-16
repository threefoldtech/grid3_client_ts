import { Keyring } from "@polkadot/keyring";
import { Expose, Transform, Type } from "class-transformer";
import { IsBoolean, IsDefined, IsEnum, IsInt, IsNotEmpty, IsString, Min, ValidateNested } from "class-validator";
import { default as md5 } from "crypto-js/md5";

import { KeypairType } from "../clients//tf-grid/client";
import { Workload } from "./workload";

class SignatureRequest {
    @Expose() @IsInt() @Min(1) twin_id: number;
    @Expose() @IsBoolean() required: boolean;
    @Expose() @IsInt() @Min(1) weight: number;

    challenge(): string {
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
    @Expose() @Transform(({ value }) => KeypairType[value]) @IsEnum(KeypairType) signature_type: KeypairType;
}

// SignatureStyleDefault default signature style is done by verifying the
// signature against the computed ChallengeHash of the deployment. In other
// words the signature results from signing the deployment
const SignatureStyleDefault = "";
// SignatureStylePolka signature by polka-wallet surrounds the ChallengeHash with
// <Bytes>$hash</Bytes> tags. If this signature-style is selected validation is done
// against the same constructed message.
const SignatureStylePolka = "polka-wallet";

class SignatureRequirement {
    @Expose() @Type(() => SignatureRequest) @ValidateNested({ each: true }) requests: SignatureRequest[] = [];
    @Expose() @IsInt() @Min(1) weight_required: number;
    @Expose() @Type(() => Signature) @ValidateNested({ each: true }) signatures: Signature[] = [];
    @Expose() @IsString() signature_style: string = SignatureStyleDefault;

    challenge(): string {
        let out = "";

        for (let i = 0; i < this.requests.length; i++) {
            out += this.requests[i].challenge();
        }

        out += this.weight_required;
        out += this.signature_style;
        return out;
    }
}

class Deployment {
    @Expose() @IsInt() @Min(0) version: number;
    @Expose() @IsInt() @Min(1) twin_id: number;
    @Expose() contract_id: number;
    @Expose() @IsInt() expiration: number;
    @Expose() @IsString() @IsDefined() metadata;
    @Expose() @IsString() @IsDefined() description;
    @Expose() @Type(() => Workload) @ValidateNested({ each: true }) workloads: Workload[];
    @Expose() @Type(() => SignatureRequirement) @ValidateNested() signature_requirement: SignatureRequirement;

    challenge(): string {
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

    challenge_hash(): string {
        return md5(this.challenge()).toString();
    }

    from_hex(s: string) {
        const result = new Uint8Array(s.length / 2);
        for (let i = 0; i < s.length / 2; i++) {
            result[i] = parseInt(s.substr(2 * i, 2), 16);
        }
        return result;
    }
    to_hex(bs): string {
        const encoded = [];
        for (let i = 0; i < bs.length; i++) {
            encoded.push("0123456789abcdef"[(bs[i] >> 4) & 15]);
            encoded.push("0123456789abcdef"[bs[i] & 15]);
        }
        return encoded.join("");
    }

    async sign(
        twin_id: number,
        mnemonic: string,
        keypairType: KeypairType,
        hash = "",
        extSigner = null,
    ): Promise<void> {
        let hex_signed_msg;
        if (extSigner) {
            this.signature_requirement.signature_style = SignatureStylePolka;
            const message = hash || this.challenge_hash();
            const { signature } = await extSigner.signer.signRaw({
                address: extSigner.address,
                data: message,
                type: "bytes",
            });
            hex_signed_msg = signature.slice(2);
        } else {
            const message = hash || this.challenge_hash();
            const message_bytes = this.from_hex(message);
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
    }
}

export { Deployment, SignatureRequirement, SignatureRequest, Signature };
