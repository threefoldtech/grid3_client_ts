import { TFClient } from "../clients/tf-grid/client";

class TFKVStore {
    client: TFClient;
    context;
    constructor(url: string, mnemonic: string) {
        this.client = new TFClient(url, mnemonic);
        this.context = this.client.kvStore;
    }
    async set(key: string, value: string) {
        if (!value) {
            return this.remove(key);
        }
        return this.client.execute(this.context, this.client.kvStore.set, [key, value]);
    }

    async get(key: string) {
        const value = this.client.execute(this.context, this.client.kvStore.get, [key]);
        if (value === null) { //TODO: check what is the return value for getting non-exist key
            return "{}";
        }
        return value;
    }

    async remove(key: string) {
        return this.client.execute(this.context, this.client.kvStore.remove, [key]);
    }
}

export { TFKVStore };

