import { default as Client } from "tfgrid-api-client";
import { Contracts } from "./contracts";
import { Twins } from "./twins";
import { KVStore } from "./kvstore";
import { Balance } from "./balance";
import { ErrorsMap } from "./errors";
import AwaitLock from "await-lock";

enum KeypairType {
    sr25519 = "sr25519",
    ed25519 = "ed25519",
}

class TFClient {
    static clients: Record<string, TFClient> = {};
    static lock: AwaitLock = new AwaitLock();
    client;
    contracts: Contracts;
    twins: Twins;
    kvStore: KVStore;
    balance: Balance;

    constructor(
        public url: string,
        public mnemonic: string,
        public storeSecret: string | Uint8Array,
        public keypairType: KeypairType = KeypairType.sr25519,
    ) {
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

    async connect(): Promise<void> {
        if (!this.isConnected()) {
            await this.client.init();
        }
    }

    disconnect(): void {
        if (this.isConnected()) {
            console.log("disconnecting");
            this.client.api.disconnect();
        }
    }

    isConnected(): boolean {
        if (this.client.api) {
            return this.client.api.isConnected;
        }
        return false;
    }

    async queryChain(func: (args: unknown[]) => unknown, args: unknown[]) {
        const context = this.client;
        await this.connect();
        console.log(`Executing method: ${func.name} with args: ${args}`);
        return await func.apply(context, args);
    }

    private async _applyExtrinsic(
        func: (args: unknown[]) => unknown,
        args: unknown[],
        resultSecttion: string,
        resultNames: string[],
    ) {
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
                        console.log("section", section, "method", method);
                        if (section === "system" && method === "ExtrinsicFailed") {
                            const errorType = ErrorsMap[resultSecttion][data.toJSON()[0].module.error];
                            reject(
                                `Failed to apply ${func.name} in module ${resultSecttion} with ${args.slice(
                                    0,
                                    -1,
                                )} due to error: ${errorType}`,
                            );
                        } else if (section === resultSecttion && resultNames.includes(method)) {
                            resolve(data.toJSON()[0]);
                        }
                    });
                }
            }
            try {
                args.push(callback);
                await func.apply(context, args);
            } catch (e) {
                reject(e);
            }
        });
    }

    async applyExtrinsic(
        func: (args: unknown[]) => unknown,
        args: unknown[],
        resultSecttion: string,
        resultNames: string[],
    ) {
        await TFClient.lock.acquireAsync();
        console.log("Lock acquired");
        let result;
        try {
            result = await this._applyExtrinsic(func, args, resultSecttion, resultNames);
        } finally {
            TFClient.lock.release();
            console.log("Lock released");
        }
        return result;
    }
}
export { TFClient, KeypairType };
