import nacl from "tweetnacl";
import utils from "tweetnacl-util";
import { randomNonce } from "../../helpers/utils";
import Crypto from "crypto-js";

class KVStore {
    tfclient;
    keypair;

    constructor(client) {
        this.tfclient = client;
    }

    async set(key: string, value: string) {
        const encryptedValue = this.encrypt(value);
        return this.tfclient.applyExtrinsic(this.tfclient.client.tfStoreSet, [key, encryptedValue], "tfkvStore", [
            "EntrySet",
        ]);
    }

    async get(key: string) {
        const encryptedValue = await this.tfclient.client.tfStoreGet(key);
        if (encryptedValue) {
            try {
                return this.decrypt(encryptedValue);
            } catch (e) {
                throw Error(`Couldn't decrypt key: ${key}`);
            }
        }
        return encryptedValue;
    }

    async list() {
        return this.tfclient.client.tfStoreList();
    }

    async remove(key: string) {
        return this.tfclient.applyExtrinsic(this.tfclient.client.tfStoreRemove, [key], "tfkvStore", ["EntryTaken"]);
    }

    async removeAll() {
        const keys = await this.list();
        for (const k of keys) {
            await this.remove(k);
        }
        return keys;
    }

    getSecretAsBytes(): Uint8Array {
        if (typeof this.tfclient.storeSecret === "string") {
            const hashed = Crypto.SHA256(this.tfclient.storeSecret);
            const asBase64 = Crypto.enc.Base64.stringify(hashed);
            return utils.decodeBase64(asBase64);
        }
        return this.tfclient.storeSecret;
    }

    encrypt(message) {
        const encodedMessage = utils.decodeUTF8(message);
        const nonce = randomNonce();
        const encryptedMessage = nacl.secretbox(encodedMessage, nonce, this.getSecretAsBytes());
        const fullMessage = Uint8Array.from([...encryptedMessage, ...nonce]);
        return utils.encodeBase64(fullMessage);
    }

    decrypt(message: string) {
        const encodedMessage = utils.decodeBase64(message);
        const encryptedMessage = encodedMessage.slice(0, -24);
        const nonce = encodedMessage.slice(-24);
        const decryptedMessage = nacl.secretbox.open(encryptedMessage, nonce, this.getSecretAsBytes());

        return utils.encodeUTF8(decryptedMessage);
    }
}

export { KVStore };
