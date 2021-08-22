"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Contracts = void 0;
const utils_1 = require("./utils");
class Contracts {
    constructor(client) {
        this.client = client;
    }
    createContract(nodeID, hash, data, publicIPs, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            const innerCallback = (res) => {
                if (res instanceof Error) {
                    console.log(res);
                    process.exit(1);
                }
                const { events = [], status } = res;
                if (status.isFinalized) {
                    // Loop through Vec<EventRecord> to display all events
                    events.forEach(({ phase, event: { data, method, section } }) => {
                        console.log("section>>>", section, "method>>>", method, "data>>>>>", data);
                        if (section === 'system' && method === 'ExtrinsicFailed') {
                            console.log('Failed');
                            // process.exit(1)
                        }
                        else if (section === 'smartContractModule' && method === 'ContractCreated') {
                            return callback(data.toJSON()[0]);
                        }
                    });
                }
            };
            return this.client.createContract(nodeID, data, hash, publicIPs, innerCallback);
        });
    }
    updateContract(id, data, hash) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.client.updateContract(id, data, hash, utils_1.callback);
        });
    }
    cancelContract(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.client.cancelContract(id, utils_1.callback);
        });
    }
    getContract(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const contract = yield this.client.getContractByID(id, utils_1.callback);
            console.log(contract);
        });
    }
}
exports.Contracts = Contracts;
