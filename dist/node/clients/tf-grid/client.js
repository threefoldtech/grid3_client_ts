"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeypairType = exports.TFClient = void 0;
const await_lock_1 = __importDefault(require("await-lock"));
const tfgrid_api_client_1 = __importDefault(require("tfgrid-api-client"));
const balance_1 = require("./balance");
const contracts_1 = require("./contracts");
const errors_1 = require("./errors");
const kvstore_1 = require("./kvstore");
const twins_1 = require("./twins");
var KeypairType;
(function (KeypairType) {
    KeypairType["sr25519"] = "sr25519";
    KeypairType["ed25519"] = "ed25519";
})(KeypairType || (KeypairType = {}));
exports.KeypairType = KeypairType;
class TFClient {
    url;
    mnemonic;
    storeSecret;
    keypairType;
    signer;
    static clients = {};
    static lock = new await_lock_1.default();
    client;
    contracts;
    twins;
    kvStore;
    balance;
    constructor(url, mnemonic, storeSecret, keypairType = KeypairType.sr25519, signer = null) {
        this.url = url;
        this.mnemonic = mnemonic;
        this.storeSecret = storeSecret;
        this.keypairType = keypairType;
        this.signer = signer;
        if (!storeSecret) {
            throw new Error("Couldn't create TFClient without store secret");
        }
        const key = `${url}:${mnemonic}:${keypairType}`;
        if (Object.keys(TFClient.clients).includes(key)) {
            return TFClient.clients[key];
        }
        this.client = new tfgrid_api_client_1.default(url, mnemonic, keypairType);
        this.contracts = new contracts_1.Contracts(this);
        this.twins = new twins_1.Twins(this);
        this.kvStore = new kvstore_1.KVStore(this);
        this.balance = new balance_1.Balance(this);
        TFClient.clients[key] = this;
    }
    async connect() {
        if (!this.isConnected()) {
            await this.client.init();
        }
    }
    async disconnect() {
        if (this.isConnected()) {
            console.log("disconnecting");
            await this.client.api.disconnect();
        }
    }
    isConnected() {
        if (this.client.api) {
            return this.client.api.isConnected;
        }
        return false;
    }
    async queryChain(func, args) {
        const context = this.client;
        await this.connect();
        console.log(`Executing method: ${func.name} with args: ${args}`);
        return await func.apply(context, args);
    }
    async _applyExtrinsic(func, args, resultSection, resultNames) {
        const context = this.client;
        await this.connect();
        return new Promise(async (resolve, reject) => {
            function callback(res) {
                if (res instanceof Error) {
                    console.error(res);
                    reject(res);
                }
                const { events = [], status } = res;
                if (status.isFinalized) {
                    events.forEach(({ phase, event: { data, method, section } }) => {
                        console.log(`phase: ${phase}, section: ${section}, method: ${method}`);
                        if (section === "system" && method === "ExtrinsicFailed") {
                            const errorType = errors_1.ErrorsMap[resultSection][data.toJSON()[0].module.error];
                            reject(`Failed to apply ${func.name} in module ${resultSection} with ${args.slice(0, -1)} due to error: ${errorType}`);
                        }
                        else if (section === resultSection && resultNames.includes(method)) {
                            resolve(data.toJSON()[0]);
                        }
                    });
                }
            }
            try {
                args.push(callback);
                await func.apply(context, args);
            }
            catch (e) {
                reject(e);
            }
        });
    }
    async applyExtrinsic(func, args, resultSection, resultNames) {
        await TFClient.lock.acquireAsync();
        console.log("Lock acquired");
        let result;
        try {
            result = await this._applyExtrinsic(func, args, resultSection, resultNames);
        }
        finally {
            TFClient.lock.release();
            console.log("Lock released");
        }
        return result;
    }
}
exports.TFClient = TFClient;
