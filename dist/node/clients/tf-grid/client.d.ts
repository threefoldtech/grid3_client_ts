import AwaitLock from "await-lock";
import { Balance } from "./balance";
import { Contracts } from "./contracts";
import { KVStore } from "./kvstore";
import { Twins } from "./twins";
declare enum KeypairType {
    sr25519 = "sr25519",
    ed25519 = "ed25519"
}
declare class TFClient {
    url: string;
    mnemonic: string;
    storeSecret: string | Uint8Array;
    keypairType: KeypairType;
    signer: any;
    static clients: Record<string, TFClient>;
    static lock: AwaitLock;
    client: any;
    contracts: Contracts;
    twins: Twins;
    kvStore: KVStore;
    balance: Balance;
    constructor(url: string, mnemonic: string, storeSecret: string | Uint8Array, keypairType?: KeypairType, signer?: any);
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    isConnected(): boolean;
    queryChain(func: (args: unknown[]) => unknown, args: unknown[]): Promise<any>;
    private _applyExtrinsic;
    applyExtrinsic(func: (args: unknown[]) => unknown, args: unknown[], resultSection: string, resultNames: string[]): Promise<any>;
}
export { TFClient, KeypairType };
//# sourceMappingURL=client.d.ts.map