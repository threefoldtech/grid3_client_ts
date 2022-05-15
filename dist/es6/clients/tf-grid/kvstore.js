var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Crypto from "crypto-js";
import nacl from "tweetnacl";
import utils from "tweetnacl-util";
import { randomNonce } from "../../helpers/utils";
class KVStore {
    constructor(client) {
        this.tfclient = client;
    }
    set(key, value) {
        return __awaiter(this, void 0, void 0, function* () {
            const encryptedValue = this.encrypt(value);
            return yield this.tfclient.applyExtrinsic(this.tfclient.client.tfStoreSet, [key, encryptedValue], "tfkvStore", [
                "EntrySet",
            ]);
        });
    }
    get(key) {
        return __awaiter(this, void 0, void 0, function* () {
            const encryptedValue = yield this.tfclient.queryChain(this.tfclient.client.tfStoreGet, [key]);
            if (encryptedValue) {
                try {
                    return this.decrypt(encryptedValue);
                }
                catch (e) {
                    throw Error(`Couldn't decrypt key: ${key}`);
                }
            }
            return encryptedValue;
        });
    }
    list() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.tfclient.queryChain(this.tfclient.client.tfStoreList, []);
        });
    }
    remove(key) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.tfclient.applyExtrinsic(this.tfclient.client.tfStoreRemove, [key], "tfkvStore", ["EntryTaken"]);
        });
    }
    removeAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const keys = yield this.list();
            for (const k of keys) {
                yield this.remove(k);
            }
            return keys;
        });
    }
    getSecretAsBytes() {
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
    decrypt(message) {
        const encodedMessage = utils.decodeBase64(message);
        const encryptedMessage = encodedMessage.slice(0, -24);
        const nonce = encodedMessage.slice(-24);
        const decryptedMessage = nacl.secretbox.open(encryptedMessage, nonce, this.getSecretAsBytes());
        return utils.encodeUTF8(decryptedMessage);
    }
}
export { KVStore };
