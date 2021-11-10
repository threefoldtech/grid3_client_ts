import { TFClient } from "../clients/tf-grid/client";
import { KVStoreSetModel, KVStoreGetModel, KVStoreRemoveModel } from "./models";
import { expose } from "../helpers/expose";
import { GridClientConfig } from "../config";

class KVStore {
    client: TFClient;
    constructor(config: GridClientConfig) {
        this.client = new TFClient(config.substrateURL, config.mnemonic, config.keypairType);
    }
    @expose
    async set(options: KVStoreSetModel) {
        return await this.client.kvStore.set(options.key, options.value);
    }
    @expose
    async get(options: KVStoreGetModel) {
        return await this.client.kvStore.get(options.key);
    }

    @expose
    async list() {
        return await this.client.kvStore.list();
    }
    @expose
    async remove(options: KVStoreRemoveModel) {
        return await this.client.kvStore.remove(options.key);
    }
}

export { KVStore as kvstore };
