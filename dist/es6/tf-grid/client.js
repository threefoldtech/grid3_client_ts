var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { default as Client } from "tfgrid-api-client";
import { Contracts } from "./contracts";
import { Twins } from "./twins";
class TFClient {
    constructor(url, mnemonic) {
        this.client = new Client(url, mnemonic);
        this.contracts = new Contracts(this);
        this.twins = new Twins(this);
    }
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.client.init();
            }
            catch (err) {
                console.error(err);
            }
        });
    }
    disconnect() {
        this.client.api.disconnect();
    }
    applyExtrinsic(func, args, resultSecttion, resultName) {
        const context = this.client;
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
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
                            console.error(`Failed to apply ${func.name} with ${args} and result of ${resultName} `, data);
                            reject(data);
                        }
                        else if (section === resultSecttion && method === resultName) {
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
    }
}
export { TFClient };
