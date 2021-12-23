import { TFClient } from "../clients/tf-grid/client";
import { GridClientConfig } from "../config";
import { expose } from "../helpers/expose";
import { validateInput } from "../helpers/validator";
import { BalanceGetModel, BalanceTransferModel } from "./models";
import { checkBalance } from "./utils";

class Balance {
    client: TFClient;
    constructor(config: GridClientConfig) {
        this.client = new TFClient(config.substrateURL, config.mnemonic, config.storeSecret, config.keypairType);
    }
    @expose
    @validateInput
    async get(options: BalanceGetModel) {
        return await this.client.balance.get(options.address);
    }
    @expose
    @validateInput
    @checkBalance
    async transfer(options: BalanceTransferModel) {
        return await this.client.balance.transfer(options.address, options.amount);
    }

    @expose
    @validateInput
    async getMyBalance() {
        return await this.client.balance.getMyBalance();
    }
}

export { Balance as balance };
