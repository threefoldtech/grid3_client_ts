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
    challenge_hash(): any;
    from_hex(s: any): Uint8Array;
    to_hex(bs: any): string;
    sign(twin_id: any, mnemonic: any, hash?: string): void;
}
export { Deployment, SignatureRequirement, SignatureRequest };
//# sourceMappingURL=deployment.d.ts.map