import { TFClient } from "../clients";
import { GridClientConfig } from "../config";
import { events, validateInput } from "../helpers";
import { expose } from "../helpers/expose";
import { RentContractCreateModel, RentContractDeleteModel, RentContractGetModel } from "./models";

class Nodes {
    client: TFClient;
    constructor(public config: GridClientConfig) {
        this.client = new TFClient(config.substrateURL, config.mnemonic, config.storeSecret, config.keypairType);
    }

    @expose
    @validateInput
    async reserve(options: RentContractCreateModel): Promise<any> {
        const rentContract = await this.getRent({ nodeId: options.nodeId });
        if (rentContract.contract_id != 0) {
            events.emit("logs", `Node Already rented by twin ${rentContract.twin_id}`);
            return rentContract;
        }
        try {
            const res = await this.client.contracts.createRentContract(options.nodeId);
            events.emit("logs", `Rent contract with id: ${res["contract_id"]} has been created`);
            return res;
        } catch (e) {
            throw Error(`Failed to create rent contract on node ${options.nodeId} due to ${e}`);
        }
    }

    @expose
    @validateInput
    async unreserve(options: RentContractDeleteModel): Promise<any> {
        const rentContract = await this.getRent({ nodeId: options.nodeId });
        if (rentContract.contract_id === 0) {
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
    async getRent(options: RentContractGetModel): Promise<any> {
        return await this.client.contracts.activeRentContractForNode(options.nodeId);
    }
}

export { Nodes as nodes };
