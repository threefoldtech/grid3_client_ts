import { MessageBusClientInterface } from "ts-rmb-client-base";

import { TFClient } from "../clients/tf-grid/client";
import {
    NodeContractCreateModel,
    NameContractCreateModel,
    ContractGetModel,
    NodeContractUpdateModel,
    ContractCancelModel,
    ContractGetByNodeIdAndHashModel,
    NodeContractsGetModel,
    NameContractGetModel,
} from "./models";
import { expose } from "../helpers/expose";

class Contracts {
    client: TFClient;
    context;
    constructor(
        public twin_id: number,
        public url: string,
        public mnemonic: string,
        public rmbClient: MessageBusClientInterface,
        public storePath: string,
        projectName = "",
    ) {
        this.client = new TFClient(url, mnemonic);
        this.context = this.client.contracts;
    }

    @expose
    async create_node(options: NodeContractCreateModel) {
        return await this.client.execute(this.context, this.client.contracts.createNode, [
            options.node_id,
            options.hash,
            options.data,
            options.public_ip,
        ]);
    }
    @expose
    async create_name(options: NameContractCreateModel) {
        return await this.client.execute(this.context, this.client.contracts.createName, [options.name]);
    }
    @expose
    async get(options: ContractGetModel) {
        return await this.client.execute(this.context, this.client.contracts.get, [options.id]);
    }
    @expose
    async get_contract_id_by_node_id_and_hash(options: ContractGetByNodeIdAndHashModel) {
        return await this.client.execute(this.context, this.client.contracts.getContractIdByNodeIdAndHash, [
            options.node_id,
            options.hash,
        ]);
    }

    @expose
    async get_node_contracts(options: NodeContractsGetModel) {
        return await this.client.execute(this.context, this.client.contracts.getNodeContracts, [
            options.node_id,
            options.state,
        ]);
    }

    @expose
    async get_name_contract(options: NameContractGetModel) {
        return await this.client.execute(this.context, this.client.contracts.getNameContract, [options.name]);
    }

    @expose
    async update_node(options: NodeContractUpdateModel) {
        return await this.client.execute(this.context, this.client.contracts.updateNode, [
            options.id,
            options.data,
            options.hash,
        ]);
    }
    @expose
    async cancel(options: ContractCancelModel) {
        return await this.client.execute(this.context, this.client.contracts.cancel, [options.id]);
    }
}

export { Contracts as contracts };
