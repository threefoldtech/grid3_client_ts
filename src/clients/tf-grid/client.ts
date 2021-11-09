import { default as Client } from "tfgrid-api-client";
import { Contracts } from "./contracts";
import { Twins } from "./twins";
import { KVStore } from "./kvstore";
import { ErrorsMap } from "./errors";

enum KeypairType {
    sr25519 = "sr25519",
    ed25519 = "ed25519"
}

class TFClient {
    static clients: Record<string, TFClient> = {};
    client;
    contracts: Contracts;
    twins: Twins;
    kvStore: KVStore;

    constructor(public url: string, public mnemonic: string, public keypairType: KeypairType = KeypairType.sr25519) {
        const key = `${url}:${mnemonic}`;
        if (Object.keys(TFClient.clients).includes(key)) {
            return TFClient.clients[key];
        }
        this.client = new Client(url, mnemonic, keypairType);
        this.contracts = new Contracts(this);
        this.twins = new Twins(this);
        this.kvStore = new KVStore(this);
        TFClient.clients[key] = this;
    }
    async connect(): Promise<void> {
        await this.client.init();
    }
    disconnect(): void {
        if (this.client.api) {
            this.client.api.disconnect();
        }
    }
    applyExtrinsic(func, args, resultSecttion: string, resultNames: string[]) {
        const context = this.client;
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
}
export { TFClient, KeypairType };
