class KVStore {
    tfclient;

    constructor(client) {
        this.tfclient = client;
    }

    async set(key: string, value: string) {
        return this.tfclient.applyExtrinsic(this.tfclient.client.tfStoreSet, [key, value], "TFKVStore", "EntrySet");
    }

    async get(key: string) {
        return this.tfclient.client.tfStoreGet(key);
    }

    async list() {
        return this.tfclient.client.tfStoreList();
    }

    async remove(key: string) {
        return this.tfclient.applyExtrinsic(this.tfclient.client.tfStoreRemove, [key], "TFKVStore", "EntryTaken");
    }
}

export { KVStore };
