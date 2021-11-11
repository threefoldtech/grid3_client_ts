import { KeypairType, TFClient } from "../clients/tf-grid/client";
import { crop } from "./utils";
class TFKVStore {
    client: TFClient;
    constructor(url: string, mnemonic: string, storeSecret: string | Uint8Array, keypairType: KeypairType) {
        this.client = new TFClient(url, mnemonic, storeSecret, keypairType);
    }

    @crop
    async set(key: string, value: string) {
        if (!value || value === "{}") {
            return await this.remove(key);
        }
        return await this.client.kvStore.set(key, value);
    }

    @crop
    async get(key: string) {
        const value = await this.client.kvStore.get(key);
        if (!value) {
            return "{}";
        }
        return value;
    }

    @crop
    async remove(key: string) {
        return await this.client.kvStore.remove(key);
    }
}

export { TFKVStore };
