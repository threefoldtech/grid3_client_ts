import { MessageBusClientInterface } from "ts-rmb-client-base";

import { TFClient } from "../clients/tf-grid/client";
import { KVStoreSetModel, KVStoreGetModel, KVStoreRemoveModel } from "./models";
import { expose } from "../helpers/expose";

class KVStore {
    client: TFClient;
    context;
    constructor(
        public twin_id: number,
        public url: string,
        public mnemonic: string,
        public rmbClient: MessageBusClientInterface,
        public storePath: string,
        projectName = "",
    ) {
        this.client = new TFClient(url, mnemonic);
        this.context = this.client.kvStore;
    }
    @expose
    async set(options: KVStoreSetModel) {
        return await this.client.execute(this.context, this.client.kvStore.set, [options.key, options.value]);
    }
    @expose
    async get(options: KVStoreGetModel) {
        return await this.client.execute(this.context, this.client.kvStore.get, [options.key]);
    }

    @expose
    async list() {
        return await this.client.execute(this.context, this.client.kvStore.list, []);
    }
    @expose
    async remove(options: KVStoreRemoveModel) {
        return await this.client.execute(this.context, this.client.kvStore.remove, [options.key]);
    }
}

export { KVStore as kvstore };
