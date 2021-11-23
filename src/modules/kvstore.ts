import { TFClient } from "../clients/tf-grid/client";
import { KVStoreSetModel, KVStoreGetModel, KVStoreRemoveModel } from "./models";
import { expose } from "../helpers/expose";
import { GridClientConfig } from "../config";
import { validateInput } from "../helpers/validator";

class KVStore {
    client: TFClient;
    constructor(config: GridClientConfig) {
        this.client = new TFClient(config.substrateURL, config.mnemonic, config.storeSecret, config.keypairType);
    }
    @expose @validateInput
    async set(options: KVStoreSetModel) {
        return await this.client.kvStore.set(options.key, options.value);
    }
    @expose @validateInput
    async get(options: KVStoreGetModel) {
        return await this.client.kvStore.get(options.key);
    }

    @expose @validateInput
    async list() {
        return await this.client.kvStore.list();
    }

    @expose @validateInput
    async remove(options: KVStoreRemoveModel) {
        return await this.client.kvStore.remove(options.key);
    }

    @expose @validateInput
    async removeAll() {
        return await this.client.kvStore.removeAll();
    }
}

export { KVStore as kvstore };
