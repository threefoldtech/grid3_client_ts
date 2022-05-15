import { TFClient } from "./client";
declare class KVStore {
    tfclient: TFClient;
    constructor(client: TFClient);
    set(key: string, value: string): Promise<any>;
    get(key: string): Promise<any>;
    list(): Promise<any>;
    remove(key: string): Promise<any>;
    removeAll(): Promise<any>;
    getSecretAsBytes(): Uint8Array;
    encrypt(message: any): string;
    decrypt(message: string): string;
}
export { KVStore };
//# sourceMappingURL=kvstore.d.ts.map