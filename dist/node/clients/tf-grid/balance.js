"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Balance = void 0;
const decimal_js_1 = require("decimal.js");
class Balance {
    tfclient;
    constructor(client) {
        this.tfclient = client;
    }
    async get(address) {
        const balances = await this.tfclient.queryChain(this.tfclient.client.getBalanceOf, [address]);
        for (const b of Object.keys(balances)) {
            const balance = new decimal_js_1.Decimal(balances[b]);
            balances[b] = balance.div(10 ** 7).toNumber();
        }
        return balances;
    }
    async getMyBalance() {
        return await this.get(this.tfclient.client.address);
    }
    async transfer(address, amount) {
        const decimalAmount = new decimal_js_1.Decimal(amount);
        const decimalAmountInTFT = decimalAmount.mul(10 ** 7).toNumber();
        await this.tfclient.applyExtrinsic(this.tfclient.client.transfer, [address, decimalAmountInTFT], "balances", [
            "Transfer",
        ]);
        return amount;
    }
}
exports.Balance = Balance;
