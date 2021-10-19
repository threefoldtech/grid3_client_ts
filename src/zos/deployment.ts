import { IsString, IsNotEmpty, IsBoolean, IsDefined, IsInt, Min, ValidateNested } from "class-validator";

import { Workload } from "./workload";

import { default as md5 } from "crypto-js/md5";
import { Keyring } from "@polkadot/keyring";

class SignatureRequest {
    // unique id as used in TFGrid DB
    @IsInt() @Min(1) twin_id: number;
    // if put on required then this twin_id needs to sign
    @IsBoolean() required: boolean;
    // signing weight
    @IsInt() @Min(1) weight: number;

    challenge() {
        let out = "";
        out += this.twin_id;
        out += this.required;
        out += this.weight;

        return out;
    }
}

// Challenge computes challenge for SignatureRequest

class Signature {
    // unique id as used in TFGrid DB
    @IsInt() @Min(1) twin_id: number;
    // signature (done with private key of the twin_id)
    @IsString() @IsNotEmpty() signature: string;
}

class SignatureRequirement {
    // the requests which can allow to get to required quorum
    @ValidateNested({ each: true }) requests: SignatureRequest[] = [];
    // minimal weight which needs to be achieved to let this workload become valid
    @IsInt() @Min(1) weight_required: number;
    @ValidateNested({ each: true }) signatures: Signature[] = [];

    // Challenge computes challenge for SignatureRequest
    challenge() {
        let out = "";

        for (let i = 0; i < this.requests.length; i++) {
            out += this.requests[i].challenge();
        }

        out += this.weight_required;
        return out;
    }
}

// deployment is given to each Zero-OS who needs to deploy something
// the zero-os'es will only take out what is relevant for them
// if signature not done on the main Deployment one, nothing will happen
class Deployment {
    // increments for each new interation of this model
    // signature needs to be achieved when version goes up
    @IsInt() @Min(0) version: number;
    // the twin who is responsible for this deployment
    @IsInt() @Min(1) twin_id: number;
    // each deployment has unique id (in relation to originator)
    @IsInt() @Min(1) contract_id: number;
    // when the full workload will stop working
    // default, 0 means no expiration
    @IsInt() expiration: number;
    @IsString() @IsDefined() metadata;
    @IsString() @IsDefined() description;

    // list of all worklaods
    @ValidateNested({ each: true }) workloads: Workload[];

    @ValidateNested() signature_requirement: SignatureRequirement;

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
