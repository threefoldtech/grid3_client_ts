import { TFClient } from "./client";
import { Graphql } from "../graphql/client";

enum ContractState {
    Created = "Created",
    Deleted = "Deleted",
    OutOfFunds = "OutOfFunds",
}
class Contracts {
    tfclient: TFClient;

    constructor(client: TFClient) {
        this.tfclient = client;
    }
    async createNode(nodeID: number, hash: string, data: string, publicIPs: number) {
        return await this.tfclient.applyExtrinsic(
            this.tfclient.client.createNodeContract,
            [nodeID, data, hash, publicIPs],
            "smartContractModule",
            ["ContractCreated"],
        );
    }

    async createName(name: string) {
        return await this.tfclient.applyExtrinsic(
            this.tfclient.client.createNameContract,
            [name],
            "smartContractModule",
            ["ContractCreated"],
        );
    }

    async updateNode(id: number, data: string, hash: string) {
        return await this.tfclient.applyExtrinsic(
            this.tfclient.client.updateNodeContract,
            [id, data, hash],
            "smartContractModule",
            ["ContractUpdated"],
        );
    }

    async cancel(id: number) {
        return await this.tfclient.applyExtrinsic(this.tfclient.client.cancelContract, [id], "smartContractModule", [
            "NodeContractCanceled",
            "NameContractCanceled",
            "ContractCanceled",
        ]);
    }

    async get(id: number) {
        return await this.tfclient.queryChain(this.tfclient.client.getContractByID, [id]);
    }

    async getContractIdByNodeIdAndHash(nodeId: number, hash: string) {
        return await this.tfclient.queryChain(this.tfclient.client.contractIDByNodeIDAndHash, [nodeId, hash]);
    }

    async getNodeContracts(nodeId: number, state: ContractState) {
        return await this.tfclient.queryChain(this.tfclient.client.nodeContracts, [nodeId, state]);
    }

    async getNameContract(name: string) {
        return await this.tfclient.queryChain(this.tfclient.client.contractIDByNameRegistration, [name]);
    }

    async listContractsByTwinId(graphqlURL, twinId) {
        const gqlClient = new Graphql(graphqlURL);
        const options = `(where: {twinId_eq: ${twinId}, state_in: [OutOfFunds, Created]})`;
        const nameContractsCount = await gqlClient.getItemTotalCount("nameContracts", options);
        const nodeContractsCount = await gqlClient.getItemTotalCount("nodeContracts", options);
        const body = `query getContracts($nameContractsCount: Int!, $nodeContractsCount: Int!){
            nameContracts(where: {twinId_eq: ${twinId}, state_in: [OutOfFunds, Created]}, limit: $nameContractsCount) {
              contractId
            }
            nodeContracts(where: {twinId_eq: ${twinId}, state_in: [OutOfFunds, Created]}, limit: $nodeContractsCount) {
              contractId
            }
          }`;
        const response = await gqlClient.query(body, {
            nodeContractsCount: nodeContractsCount,
            nameContractsCount: nameContractsCount,
        });
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
