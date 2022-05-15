"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KVStore = void 0;
const crypto_js_1 = __importDefault(require("crypto-js"));
const tweetnacl_1 = __importDefault(require("tweetnacl"));
const tweetnacl_util_1 = __importDefault(require("tweetnacl-util"));
const utils_1 = require("../../helpers/utils");
class KVStore {
    tfclient;
    constructor(client) {
        this.tfclient = client;
    }
    async set(key, value) {
        const encryptedValue = this.encrypt(value);
        return await this.tfclient.applyExtrinsic(this.tfclient.client.tfStoreSet, [key, encryptedValue], "tfkvStore", [
            "EntrySet",
        ]);
    }
    async get(key) {
        const encryptedValue = await this.tfclient.queryChain(this.tfclient.client.tfStoreGet, [key]);
        if (encryptedValue) {
            try {
                return this.decrypt(encryptedValue);
            }
            catch (e) {
                throw Error(`Couldn't decrypt key: ${key}`);
            }
        }
        return encryptedValue;
    }
    async list() {
        return await this.tfclient.queryChain(this.tfclient.client.tfStoreList, []);
    }
    async remove(key) {
        return this.tfclient.applyExtrinsic(this.tfclient.client.tfStoreRemove, [key], "tfkvStore", ["EntryTaken"]);
    }
    async removeAll() {
        const keys = await this.list();
        for (const k of keys) {
            await this.remove(k);
        }
        return keys;
    }
    getSecretAsBytes() {
        if (typeof this.tfclient.storeSecret === "string") {
            const hashed = crypto_js_1.default.SHA256(this.tfclient.storeSecret);
            const asBase64 = crypto_js_1.default.enc.Base64.stringify(hashed);
            return tweetnacl_util_1.default.decodeBase64(asBase64);
        }
        return this.tfclient.storeSecret;
    }
    encrypt(message) {
        const encodedMessage = tweetnacl_util_1.default.decodeUTF8(message);
        const nonce = (0, utils_1.randomNonce)();
        const encryptedMessage = tweetnacl_1.default.secretbox(encodedMessage, nonce, this.getSecretAsBytes());
        const fullMessage = Uint8Array.from([...encryptedMessage, ...nonce]);
        return tweetnacl_util_1.default.encodeBase64(fullMessage);
    }
    decrypt(message) {
        const encodedMessage = tweetnacl_util_1.default.decodeBase64(message);
        const encryptedMessage = encodedMessage.slice(0, -24);
        const nonce = encodedMessage.slice(-24);
        const decryptedMessage = tweetnacl_1.default.secretbox.open(encryptedMessage, nonce, this.getSecretAsBytes());
        return tweetnacl_util_1.default.encodeUTF8(decryptedMessage);
    }
}
exports.KVStore = KVStore;
