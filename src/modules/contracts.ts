import { TFClient } from "../clients/tf-grid/client";
import { GridClientConfig } from "../config";
import { expose } from "../helpers/expose";
import { validateInput } from "../helpers/validator";
import { Nodes } from "../primitives/nodes";
import {
    ContractCancelModel,
    ContractConsumption,
    ContractGetByNodeIdAndHashModel,
    ContractGetModel,
    ContractsByAddress,
    ContractsByTwinId,
    NameContractCreateModel,
    NameContractGetModel,
    NodeContractCreateModel,
    NodeContractsGetModel,
    NodeContractUpdateModel,
} from "./models";
import { checkBalance } from "./utils";

class Contracts {
    client: TFClient;
    nodes: Nodes;
    constructor(public config: GridClientConfig) {
        this.client = new TFClient(config.substrateURL, config.mnemonic, config.storeSecret, config.keypairType);
        this.nodes = new Nodes(config.graphqlURL, config.rmbClient["proxyURL"]);
    }

    @expose
    @validateInput
    @checkBalance
    async create_node(options: NodeContractCreateModel) {
        return await this.client.contracts.createNode(options.node_id, options.hash, options.data, options.public_ip);
    }
    @expose
    @validateInput
    @checkBalance
    async create_name(options: NameContractCreateModel) {
        return await this.client.contracts.createName(options.name);
    }
    @expose
    @validateInput
    async get(options: ContractGetModel) {
        return await this.client.contracts.get(options.id);
    }
    @expose
    @validateInput
    async get_contract_id_by_node_id_and_hash(options: ContractGetByNodeIdAndHashModel) {
        return await this.client.contracts.getContractIdByNodeIdAndHash(options.node_id, options.hash);
    }

    @expose
    @validateInput
    async get_name_contract(options: NameContractGetModel) {
        return await this.client.contracts.getNameContract(options.name);
    }

    @expose
    @validateInput
    @checkBalance
    async update_node(options: NodeContractUpdateModel) {
        return await this.client.contracts.updateNode(options.id, options.data, options.hash);
    }
    @expose
    @validateInput
    @checkBalance
    async cancel(options: ContractCancelModel) {
        return await this.client.contracts.cancel(options.id);
    }

    @expose
    @validateInput
    async listMyContracts() {
        return await this.client.contracts.listMyContracts(this.config.graphqlURL);
    }

    @expose
    @validateInput
    async listContractsByTwinId(options: ContractsByTwinId) {
        return await this.client.contracts.listContractsByTwinId(this.config.graphqlURL, options.twinId);
    }

    @expose
    @validateInput
    async listContractsByAddress(options: ContractsByAddress) {
        return await this.client.contracts.listContractsByAddress(this.config.graphqlURL, options.address);
    }
    /**
     * WARNING: Please be careful when executing this method, it will delete all your contracts.
     * @returns Promise
     */
    @expose
    @validateInput
    @checkBalance
    async cancelMyContracts(): Promise<Record<string, number>[]> {
        return await this.client.contracts.cancelMyContracts(this.config.graphqlURL);
    }

    /**
     * Get contract consumption per hour in TFT.
     *
     * @param  {ContractConsumption} options
     * @returns {Promise<number>}
     */
    @expose
    @validateInput
    async getConsumption(options: ContractConsumption): Promise<number> {
        return await this.client.contracts.getConsumption(options.id, this.config.graphqlURL);
    }
}

export { Contracts as contracts };
