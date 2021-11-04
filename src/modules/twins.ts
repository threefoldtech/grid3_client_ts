import { MessageBusClientInterface } from "ts-rmb-client-base";

import { TFClient } from "../clients/tf-grid/client";
import { TwinCreateModel, TwinGetModel, TwinGetByAccountIdModel, TwinDeleteModel } from "./models";
import { expose } from "../helpers/expose";
import { BackendStorageType } from "../storage/backend";

class Twins {
    client: TFClient;
    context;
    constructor(
        public twin_id: number,
        public url: string,
        public mnemonic: string,
        public rmbClient: MessageBusClientInterface,
        public storePath: string,
        public projectName = "",
        public backendStorageType: BackendStorageType = BackendStorageType.default,
    ) {
        this.client = new TFClient(url, mnemonic);
        this.context = this.client.twins;
    }
    @expose
    async create(options: TwinCreateModel) {
        return await this.client.execute(this.context, this.client.twins.create, [options.ip]);
    }
    @expose
    async get(options: TwinGetModel) {
        return await this.client.execute(this.context, this.client.twins.get, [options.id]);
    }

    @expose
    async get_my_twin_id() {
        return await this.client.execute(this.context, this.client.twins.getMyTwinId, []);
    }

    @expose
    async get_twin_id_by_account_id(options: TwinGetByAccountIdModel) {
        return await this.client.execute(this.context, this.client.twins.getTwinIdByAccountId, [options.public_key]);
    }

    @expose
    async list() {
        return await this.client.execute(this.context, this.client.twins.list, []);
    }
    @expose
    async delete(options: TwinDeleteModel) {
        return await this.client.execute(this.context, this.client.twins.delete, [options.id]);
    }
}

export { Twins as twins };
