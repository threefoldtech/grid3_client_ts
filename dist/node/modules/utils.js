"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkBalance = void 0;
const client_1 = require("../client");
const client_2 = require("../clients/tf-grid/client");
// used as decorator
function checkBalance(target, propertyKey, descriptor) {
    const method = descriptor.value;
    descriptor.value = async function (...args) {
        const { substrateURL, mnemonic, storePath, keypairType } = client_1.GridClient.config;
        const tfclient = new client_2.TFClient(substrateURL, mnemonic, storePath, keypairType);
        const balances = await tfclient.balance.getMyBalance();
        if (balances["free"] < 1) {
            throw Error("Balance is not enough to apply an extrinsic");
        }
        return await method.apply(this, args);
    };
}
exports.checkBalance = checkBalance;
