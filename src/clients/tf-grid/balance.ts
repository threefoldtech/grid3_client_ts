import { Decimal } from "decimal.js";

class Balance {
    tfclient;

    constructor(client) {
        this.tfclient = client;
    }

    async get(address: string) {
        await this.tfclient.connect();
        const balances = await this.tfclient.client.getBalanceOf(address);
        for (const b of Object.keys(balances)) {
            const balance = new Decimal(balances[b]);
            balances[b] = balance.div(10 ** 7).toNumber();
        }
        return balances;
    }

    async getMyBalance() {
        await this.tfclient.connect();
        return this.get(this.tfclient.client.address);
    }

    async transfer(address: string, amount: number) {
        await this.tfclient.connect();
        const decimalAmount = new Decimal(amount);
        const decimalAmountInTFT = decimalAmount.mul(10 ** 7).toNumber();
        return this.tfclient.applyExtrinsic(this.tfclient.client.transfer, [address, decimalAmountInTFT], "balances", [
            "Transfer",
        ]);
    }
}

export { Balance };
