import { KeypairType } from "../clients//tf-grid/client";
import { Workload } from "./workload";
declare class SignatureRequest {
    twin_id: number;
    required: boolean;
    weight: number;
    challenge(): string;
}
declare class Signature {
    twin_id: number;
    signature: string;
    signature_type: KeypairType;
}
declare class SignatureRequirement {
    requests: SignatureRequest[];
    weight_required: number;
    signatures: Signature[];
    challenge(): string;
}
declare class Deployment {
    version: number;
    twin_id: number;
    contract_id: number;
    expiration: number;
    metadata: any;
    description: any;
    workloads: Workload[];
    signature_requirement: SignatureRequirement;
    challenge(): string;
    challenge_hash(): string;
    from_hex(s: string): Uint8Array;
    to_hex(bs: any): string;
    sign(twin_id: number, mnemonic: string, keypairType: KeypairType, hash?: string, signer?: any): Promise<void>;
}
export { Deployment, SignatureRequirement, SignatureRequest, Signature };
//# sourceMappingURL=deployment.d.ts.map