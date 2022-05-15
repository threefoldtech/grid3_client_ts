var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Decimal } from "decimal.js";
class Balance {
    constructor(client) {
        this.tfclient = client;
    }
    get(address) {
        return __awaiter(this, void 0, void 0, function* () {
            const balances = yield this.tfclient.queryChain(this.tfclient.client.getBalanceOf, [address]);
            for (const b of Object.keys(balances)) {
                const balance = new Decimal(balances[b]);
                balances[b] = balance.div(Math.pow(10, 7)).toNumber();
            }
            return balances;
        });
    }
    getMyBalance() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.get(this.tfclient.client.address);
        });
    }
    transfer(address, amount) {
        return __awaiter(this, void 0, void 0, function* () {
            const decimalAmount = new Decimal(amount);
            const decimalAmountInTFT = decimalAmount.mul(Math.pow(10, 7)).toNumber();
            yield this.tfclient.applyExtrinsic(this.tfclient.client.transfer, [address, decimalAmountInTFT], "balances", [
                "Transfer",
            ]);
            return amount;
        });
    }
}
export { Balance };
