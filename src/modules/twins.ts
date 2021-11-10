import { TFClient } from "../clients/tf-grid/client";
import { TwinCreateModel, TwinGetModel, TwinGetByAccountIdModel, TwinDeleteModel } from "./models";
import { expose } from "../helpers/expose";
import { GridClientConfig } from "../config";

class Twins {
    client: TFClient;
    constructor(config: GridClientConfig) {
        this.client = new TFClient(config.substrateURL, config.mnemonic, config.storeSecret, config.keypairType);
    }
    @expose
    async create(options: TwinCreateModel) {
        return await this.client.twins.create(options.ip);
    }
    @expose
    async get(options: TwinGetModel) {
        return await this.client.twins.get(options.id);
    }

    @expose
    async get_my_twin_id() {
        return await this.client.twins.getMyTwinId();
    }

    @expose
    async get_twin_id_by_account_id(options: TwinGetByAccountIdModel) {
        return await this.client.twins.getTwinIdByAccountId(options.public_key);
    }

    @expose
    async list() {
        return await this.client.twins.list();
    }
    @expose
    async delete(options: TwinDeleteModel) {
        return await this.client.twins.delete(options.id);
    }
}

export { Twins as twins };
