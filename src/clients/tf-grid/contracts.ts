import { send } from "../../helpers/requests";

enum ContractState {
    Created = "Created",
    Deleted = "Deleted",
    OutOfFunds = "OutOfFunds",
}
class Contracts {
    tfclient;

    constructor(client) {
        this.tfclient = client;
    }
    async createNode(nodeID: number, hash: string, data: string, publicIPs: number) {
        return this.tfclient.applyExtrinsic(
            this.tfclient.client.createNodeContract,
            [nodeID, data, hash, publicIPs],
            "smartContractModule",
            ["ContractCreated"],
        );
    }

    async createName(name: string) {
        return this.tfclient.applyExtrinsic(this.tfclient.client.createNameContract, [name], "smartContractModule", [
            "ContractCreated",
        ]);
    }

    async updateNode(id: number, data: string, hash: string) {
        return this.tfclient.applyExtrinsic(
            this.tfclient.client.updateNodeContract,
            [id, data, hash],
            "smartContractModule",
            ["ContractUpdated"],
        );
    }

    async cancel(id: number) {
        return this.tfclient.applyExtrinsic(this.tfclient.client.cancelContract, [id], "smartContractModule", [
            "NodeContractCanceled",
            "NameContractCanceled",
            "ContractCanceled",
        ]);
    }

    async get(id: number) {
        return this.tfclient.client.getContractByID(id);
    }

    async getContractIdByNodeIdAndHash(nodeId: number, hash: string) {
        return this.tfclient.client.contractIDByNodeIDAndHash(nodeId, hash);
    }

    async getNodeContracts(nodeId: number, state: ContractState) {
        return this.tfclient.client.nodeContracts(nodeId, state);
    }

    async getNameContract(name: string) {
        return this.tfclient.client.contractIDByNameRegistration(name);
    }

    async listContractsByTwinId(graphqlURL, twinId) {
        const headers = { "Content-Type": "application/json" };
        const body = `{
            nameContracts(where: {twinId_eq: ${twinId}, state_in: [OutOfFunds, Created]}) {
              contractId
            }
            nodeContracts(where: {twinId_eq: ${twinId}, state_in: [OutOfFunds, Created]}) {
              contractId
            }
          }`;
        const response = await send("post", graphqlURL, JSON.stringify({ query: body }), headers);
        return response["data"];
    }

    async listContractsByAddress(graphqlURL, address) {
        const twinId = await this.tfclient.twins.getTwinIdByAccountId(address);
        return await this.listContractsByTwinId(graphqlURL, twinId);
    }

    async listMyContracts(graphqlURL) {
        const twinId = await this.tfclient.twins.getMyTwinId();
        return await this.listContractsByTwinId(graphqlURL, twinId);
    }

    /**
     * WARNING: Please be careful when executing this method, it will delete all your contracts.
     * @param  {string} graphqlURL
     * @returns Promise
     */
    async cancelMyContracts(graphqlURL: string): Promise<Record<string, number>[]> {
        const allContracts = await this.listMyContracts(graphqlURL);
        const contracts = [...allContracts["nameContracts"], ...allContracts["nodeContracts"]];
        for (const contract of contracts) {
            await this.cancel(contract["contractId"]);
        }
        return contracts;
    }
}

export { Contracts, ContractState };
