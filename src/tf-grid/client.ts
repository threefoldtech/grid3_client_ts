import { default as Client } from "tfgrid-api-client";
import { Contracts } from "./contracts";
import { Twins } from "./twins";

class TFClient {
    client;
    contracts: Contracts;
    twins: Twins;

    constructor(url: string, mnemonic: string) {
        this.client = new Client(url, mnemonic);
        this.contracts = new Contracts(this);
        this.twins = new Twins(this);
    }
    async connect(): Promise<void> {
        try {
            await this.client.init();
        } catch (err) {
            console.error(err);
        }
    }
    disconnect(): void {
        this.client.api.disconnect();
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
                            console.error(
                                `Failed to apply ${func.name} with ${args} and result of ${resultName} `,
                                data,
                            );
                            reject(data);
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
}
export { TFClient };
