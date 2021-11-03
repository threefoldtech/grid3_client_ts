import { default as Client } from "tfgrid-api-client";
import { Contracts } from "./contracts";
import { Twins } from "./twins";
import { KVStore } from "./kvstore";
import { ErrorsMap } from "./errors";

class TFClient {
    client;
    contracts: Contracts;
    twins: Twins;
    kvStore: KVStore;

    constructor(url: string, mnemonic: string) {
        this.client = new Client(url, mnemonic);
        this.contracts = new Contracts(this);
        this.twins = new Twins(this);
        this.kvStore = new KVStore(this);
    }
    async connect(): Promise<void> {
        await this.client.init();
    }
    disconnect(): void {
        if (this.client.api) {
            this.client.api.disconnect();
        }
    }
    applyExtrinsic(func, args, resultSecttion: string, resultName: string) {
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
                        } else if (section === resultSecttion && method === resultName) {
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

    async execute(context, method, args) {
        let result;
        try {
            await this.connect();
            console.log(`Executing method: ${method.name} with args: ${args}`);
            result = await method.apply(context, args);
        } catch (e) {
            throw Error(e);
        } finally {
            this.disconnect();
        }
        return result;
    }
}
export { TFClient };
