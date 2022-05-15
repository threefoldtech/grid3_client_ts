import { KeypairType } from "../clients/tf-grid/client";
declare const appPath: string;
declare enum StorageUpdateAction {
    add = "add",
    delete = "delete"
}
declare enum BackendStorageType {
    auto = "auto",
    fs = "fs",
    localstorage = "localstorage",
    tfkvstore = "tfkvstore"
}
declare class BackendStorage {
    type: BackendStorageType;
    storage: any;
    constructor(type: BackendStorageType, substrateURL: string, mnemonic: string, storeSecret: string | Uint8Array, keypairType: KeypairType);
    static isEnvNode(): boolean;
    load(key: string): Promise<any>;
    list(key: string): Promise<any>;
    dump(key: string, value: any): Promise<any>;
    update(key: string, field: string, data?: any, action?: StorageUpdateAction): Promise<void>;
}
export { BackendStorage, BackendStorageType, StorageUpdateAction, appPath };
//# sourceMappingURL=backend.d.ts.map