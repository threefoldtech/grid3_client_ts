import { TFClient } from "../clients/tf-grid/client";
import { GridClientConfig } from "../config";
import { KVStoreGetModel, KVStoreRemoveModel, KVStoreSetModel } from "./models";
declare class KVStore {
    client: TFClient;
    constructor(config: GridClientConfig);
    set(options: KVStoreSetModel): Promise<any>;
    get(options: KVStoreGetModel): Promise<any>;
    list(): Promise<any>;
    remove(options: KVStoreRemoveModel): Promise<any>;
    removeAll(): Promise<any>;
}
export { KVStore as kvstore };
//# sourceMappingURL=kvstore.d.ts.map