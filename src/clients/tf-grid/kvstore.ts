import { mnemonicToMiniSecret } from "@polkadot/util-crypto";
import nacl from "tweetnacl";
import utils from "tweetnacl-util";

class KVStore {
    tfclient;
    keypair;

    constructor(client) {
        this.tfclient = client;
        const secret = mnemonicToMiniSecret(client.mnemonic);
        this.keypair = nacl.box.keyPair.fromSecretKey(secret);
    }

    async set(key: string, value: string) {
        const encryptedValue = this.encrypt(value);
        return this.tfclient.applyExtrinsic(this.tfclient.client.tfStoreSet, [key, encryptedValue], "tfkvStore", ["EntrySet"]);
    }

    async get(key: string) {
        const encryptedValue = await this.tfclient.client.tfStoreGet(key);
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
        return this.tfclient.client.tfStoreList();
    }

    async remove(key: string) {
        return this.tfclient.applyExtrinsic(this.tfclient.client.tfStoreRemove, [key], "tfkvStore", ["EntryTaken"]);
    }

    encrypt(message) {
        const encodedMessage = utils.decodeUTF8(message);
        const nonce = nacl.randomBytes(nacl.box.nonceLength);
        const encryptedMessage = nacl.box(
            encodedMessage,
            nonce,
            this.keypair.publicKey,
            this.keypair.secretKey
        );
        const fullMessage = Uint8Array.from([...encryptedMessage, ...nonce]);
        return utils.encodeBase64(fullMessage);
    }

    decrypt(message: string) {
        const encodedMessage = utils.decodeBase64(message);
        const encryptedMessage = encodedMessage.slice(0, -24);
        const nonce = encodedMessage.slice(-24);
        const decryptedMessage = nacl.box.open(
            encryptedMessage,
            nonce,
            this.keypair.publicKey,
            this.keypair.secretKey
        );

        return utils.encodeUTF8(decryptedMessage);
    }
}

export { KVStore };;
