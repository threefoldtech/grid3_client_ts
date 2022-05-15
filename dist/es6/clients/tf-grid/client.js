var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import AwaitLock from "await-lock";
import { default as Client } from "tfgrid-api-client";
import { Balance } from "./balance";
import { Contracts } from "./contracts";
import { ErrorsMap } from "./errors";
import { KVStore } from "./kvstore";
import { Twins } from "./twins";
var KeypairType;
(function (KeypairType) {
    KeypairType["sr25519"] = "sr25519";
    KeypairType["ed25519"] = "ed25519";
})(KeypairType || (KeypairType = {}));
class TFClient {
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
        this.client = new Client(url, mnemonic, keypairType);
        this.contracts = new Contracts(this);
        this.twins = new Twins(this);
        this.kvStore = new KVStore(this);
        this.balance = new Balance(this);
        TFClient.clients[key] = this;
    }
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.isConnected()) {
                yield this.client.init();
            }
        });
    }
    disconnect() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.isConnected()) {
                console.log("disconnecting");
                yield this.client.api.disconnect();
            }
        });
    }
    isConnected() {
        if (this.client.api) {
            return this.client.api.isConnected;
        }
        return false;
    }
    queryChain(func, args) {
        return __awaiter(this, void 0, void 0, function* () {
            const context = this.client;
            yield this.connect();
            console.log(`Executing method: ${func.name} with args: ${args}`);
            return yield func.apply(context, args);
        });
    }
    _applyExtrinsic(func, args, resultSection, resultNames) {
        return __awaiter(this, void 0, void 0, function* () {
            const context = this.client;
            yield this.connect();
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
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
                                const errorType = ErrorsMap[resultSection][data.toJSON()[0].module.error];
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
                    yield func.apply(context, args);
                }
                catch (e) {
                    reject(e);
                }
            }));
        });
    }
    applyExtrinsic(func, args, resultSection, resultNames) {
        return __awaiter(this, void 0, void 0, function* () {
            yield TFClient.lock.acquireAsync();
            console.log("Lock acquired");
            let result;
            try {
                result = yield this._applyExtrinsic(func, args, resultSection, resultNames);
            }
            finally {
                TFClient.lock.release();
                console.log("Lock released");
            }
            return result;
        });
    }
}
TFClient.clients = {};
TFClient.lock = new AwaitLock();
export { TFClient, KeypairType };
