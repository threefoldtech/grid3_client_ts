import { TFClient } from "../clients";
import { GridClientConfig } from "../config";
import { events, validateInput } from "../helpers";
import { expose } from "../helpers/expose";
import { RentContractCreateModel, RentContractDeleteModel, RentContractGetModel } from "./models";
import { checkBalance } from "./utils";

class Nodes {
    client: TFClient;
    constructor(public config: GridClientConfig) {
        this.client = new TFClient(config.substrateURL, config.mnemonic, config.storeSecret, config.keypairType);
    }

    @expose
    @validateInput
    @checkBalance
    async reserve(options: RentContractCreateModel) {
        const rentContract = await this.getRent({ nodeId: options.nodeId });
        if (rentContract.contractId != 0) {
            throw Error(`Node Already rented by user with twinId ${rentContract.twinId}`);
        }
        try {
            const res = await this.client.contracts.createRentContract(options.nodeId);
            events.emit("logs", `Rent contract with id: ${res["contractId"]} has been created`);
            return res;
        } catch (e) {
            throw Error(`Failed to create rent contract on node ${options.nodeId} due to ${e}`);
        }
    }

    @expose
    @validateInput
    @checkBalance
    async unreserve(options: RentContractDeleteModel) {
        const rentContract = await this.getRent({ nodeId: options.nodeId });
        if (rentContract.contractId === 0) {
            events.emit("logs", `No rent contract found for node ${options.nodeId}`);
            return rentContract;
        }
        try {
            const res = await this.client.contracts.cancel(rentContract.contract_id);
            events.emit("logs", `Rent contract for node ${options.nodeId} has been deleted`);
            return res;
        } catch (e) {
            throw Error(`Failed to delete rent contract on node ${options.nodeId} due to ${e}`);
        }
    }

    @expose
    @validateInput
    async getRent(options: RentContractGetModel) {
        return await this.client.contracts.activeRentContractForNode(options.nodeId);
    }
}

export { Nodes as nodes };
