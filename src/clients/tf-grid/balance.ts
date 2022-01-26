import { Decimal } from "decimal.js";

import { TFClient } from "./client";

class Balance {
    tfclient: TFClient;

    constructor(client: TFClient) {
        this.tfclient = client;
    }

    async get(address: string): Promise<Record<string, number>> {
        const balances = await this.tfclient.queryChain(this.tfclient.client.getBalanceOf, [address]);
        for (const b of Object.keys(balances)) {
            const balance = new Decimal(balances[b]);
            balances[b] = balance.div(10 ** 7).toNumber();
        }
        return balances;
    }

    async getMyBalance(): Promise<Record<string, number>> {
        return await this.get(this.tfclient.client.address);
    }

    async transfer(address: string, amount: number): Promise<number> {
        const decimalAmount = new Decimal(amount);
        const decimalAmountInTFT = decimalAmount.mul(10 ** 7).toNumber();
        await this.tfclient.applyExtrinsic(this.tfclient.client.transfer, [address, decimalAmountInTFT], "balances", [
            "Transfer",
        ]);
        return amount;
    }
}

export { Balance };
