"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TFClient = void 0;
const tfgrid_api_client_1 = __importDefault(require("tfgrid-api-client"));
const contracts_1 = require("./contracts");
const twins_1 = require("./twins");
class TFClient {
    client;
    contracts;
    twins;
    constructor(url, mnemonic) {
        this.client = new tfgrid_api_client_1.default(url, mnemonic);
        this.contracts = new contracts_1.Contracts(this);
        this.twins = new twins_1.Twins(this);
    }
    async connect() {
        try {
            await this.client.init();
        }
        catch (err) {
            console.error(err);
        }
    }
    disconnect() {
        this.client.api.disconnect();
    }
    applyExtrinsic(func, args, resultSecttion, resultName) {
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
                await func.apply(context, args);
            }
            catch (e) {
                reject(e);
            }
        });
    }
}
exports.TFClient = TFClient;
