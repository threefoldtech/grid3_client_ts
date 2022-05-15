import { KeypairType, TFClient } from "../clients/tf-grid/client";
declare class TFKVStore {
    client: TFClient;
    constructor(url: string, mnemonic: string, storeSecret: string | Uint8Array, keypairType: KeypairType);
    set(key: string, value: string): Promise<any>;
    get(key: string): Promise<any>;
    remove(key: string): Promise<any>;
    list(key: string): Promise<unknown[]>;
    split(key: string, value: string): {};
}
export { TFKVStore };
//# sourceMappingURL=tfkvstore.d.ts.map