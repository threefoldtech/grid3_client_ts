import { Decimal } from "decimal.js";

import { ContractStates } from "../../modules";
import { Graphql } from "../graphql/client";
import { TFClient } from "./client";

const TWO_WEEKS = 1657584000;

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

    async createRentContract(nodeId: number) {
        return await this.tfclient.applyExtrinsic(
            this.tfclient.client.createRentContract,
            [nodeId],
            "smartContractModule",
            ["ContractCreated"],
        );
    }

    async activeRentContractForNode(nodeId: number) {
        return await this.tfclient.queryChain(this.tfclient.client.activeRentContractForNode, [nodeId]);
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
            "RentContractCanceled",
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

    async listContractsByTwinId(
        graphqlURL,
        twinId,
        stateList: ContractStates[] = [ContractStates.Created, ContractStates.GracePeriod],
    ) {
        const state = `[${stateList.join(", ")}]`;
        const gqlClient = new Graphql(graphqlURL);
        const options = `(where: {twinID_eq: ${twinId}, state_in: ${state}}, orderBy: twinID_ASC)`;
        const nameContractsCount = await gqlClient.getItemTotalCount("nameContracts", options);
        const nodeContractsCount = await gqlClient.getItemTotalCount("nodeContracts", options);
        const rentContractsCount = await gqlClient.getItemTotalCount("rentContracts", options);
        const body = `query getContracts($nameContractsCount: Int!, $nodeContractsCount: Int!, $rentContractsCount: Int!){
            nameContracts(where: {twinID_eq: ${twinId}, state_in: ${state}}, limit: $nameContractsCount) {
              contractID
              state
              name
              createdAt
            }
            nodeContracts(where: {twinID_eq: ${twinId}, state_in: ${state}}, limit: $nodeContractsCount) {
              contractID
              deploymentData
              state
              createdAt
              nodeID
            }
            rentContracts(where: {twinID_eq: ${twinId}, state_in: ${state}}, limit: $rentContractsCount) {
              contractID
              state
              createdAt
              nodeID
            }
          }`;
        const response = await gqlClient.query(body, {
            nodeContractsCount: nodeContractsCount,
            nameContractsCount: nameContractsCount,
            rentContractsCount: rentContractsCount,
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
        const body = `query getConsumption($contractId: BigInt!){
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

    async listMyContracts(graphqlURL, state?: ContractStates[]) {
        const twinId = await this.tfclient.twins.getMyTwinId();
        return await this.listContractsByTwinId(graphqlURL, twinId, state);
    }

    /**
     * WARNING: Please be careful when executing this method, it will delete all your contracts.
     * @param  {string} graphqlURL
     * @returns Promise
     */
    async cancelMyContracts(graphqlURL: string): Promise<Record<string, number>[]> {
        const allContracts = await this.listMyContracts(graphqlURL);
        const contracts = [
            ...allContracts["nameContracts"],
            ...allContracts["nodeContracts"],
            ...allContracts["rentContracts"],
        ];
        for (const contract of contracts) {
            await this.cancel(contract["contractID"]);
        }
        return contracts;
    }

    async getDeletionTime(contractId: number): Promise<number> {
        const contract = await this.get(contractId);
        if (contract.state.created === null) return 0;

        const blockNumber = contract.state["gracePeriod"];

        const blockHash = await this.tfclient.rpcCall(this.tfclient.client.getBlockHash, [blockNumber]);

        const blockTime = +(await this.tfclient.queryChain(this.tfclient.client.getBlockTime, [blockHash]));

        return blockTime + TWO_WEEKS;
    }
}

export { Contracts };
