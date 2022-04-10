import { Decimal } from "decimal.js";

import { Graphql } from "../graphql/client";
import { TFClient } from "./client";

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
        const contract = await this.get(id);
        if (Object.keys(contract.state).includes("deleted")) {
            return id;
        }
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

    async getNameContract(name: string) {
        return await this.tfclient.queryChain(this.tfclient.client.contractIDByNameRegistration, [name]);
    }

    async listContractsByTwinId(graphqlURL, twinId) {
        const gqlClient = new Graphql(graphqlURL);
        const options = `(where: {twinID_eq: ${twinId}, state_eq: Created}, orderBy: twinID_ASC)`;
        const nameContractsCount = await gqlClient.getItemTotalCount("nameContracts", options);
        const nodeContractsCount = await gqlClient.getItemTotalCount("nodeContracts", options);
        const body = `query getContracts($nameContractsCount: Int!, $nodeContractsCount: Int!){
            nameContracts(where: {twinID_eq: ${twinId}, state_eq: Created}, limit: $nameContractsCount) {
              contractID
            }
            nodeContracts(where: {twinID_eq: ${twinId}, state_eq: Created}, limit: $nodeContractsCount) {
              contractID
            }
          }`;
        const response = await gqlClient.query(body, {
            nodeContractsCount: nodeContractsCount,
            nameContractsCount: nameContractsCount,
        });
        return response["data"];
    }
    /**
     * Get contract consumption per hour in TFT.
     *
     * @param  {number} id
     * @param  {string} graphqlURL
     * @returns {Promise<number>}
     */
    async getConsumption(id: number, graphqlURL: string): Promise<number> {
        const gqlClient = new Graphql(graphqlURL);
        const body = `query getConsumption($contractId: Int!){
            contractBillReports(where: {contractID_eq: $contractId}) {
                amountBilled
            }
          }`;
        const response = await gqlClient.query(body, { contractId: id });
        const billReports = response["data"]["contractBillReports"];
        if (billReports.length !== 0) {
            const amountBilled = new Decimal(billReports[billReports.length - 1]["amountBilled"]);
            return amountBilled.div(10 ** 7).toNumber();
        }
        return 0;
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
            await this.cancel(contract["contractID"]);
        }
        return contracts;
    }
}

export { Contracts };
