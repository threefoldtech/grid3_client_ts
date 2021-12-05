import { Decimal } from "decimal.js";

class Balance {
    tfclient;

    constructor(client) {
        this.tfclient = client;
    }

    async get(address: string) {
        const balances = await this.tfclient.queryChain(this.tfclient.client.getBalanceOf, [address]);
        for (const b of Object.keys(balances)) {
            const balance = new Decimal(balances[b]);
            balances[b] = balance.div(10 ** 7).toNumber();
        }
        return balances;
    }

    async getMyBalance() {
        return await this.get(this.tfclient.client.address);
    }

    async transfer(address: string, amount: number) {
        const decimalAmount = new Decimal(amount);
        const decimalAmountInTFT = decimalAmount.mul(10 ** 7).toNumber();
        return await this.tfclient.applyExtrinsic(
            this.tfclient.client.transfer,
            [address, decimalAmountInTFT],
            "balances",
            ["Transfer"],
        );
    }
}

export { Balance };
