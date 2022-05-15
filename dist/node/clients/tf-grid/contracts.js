"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Contracts = void 0;
const decimal_js_1 = require("decimal.js");
const client_1 = require("../graphql/client");
class Contracts {
    tfclient;
    constructor(client) {
        this.tfclient = client;
    }
    async createNode(nodeID, hash, data, publicIPs) {
        return await this.tfclient.applyExtrinsic(this.tfclient.client.createNodeContract, [nodeID, data, hash, publicIPs], "smartContractModule", ["ContractCreated"]);
    }
    async createName(name) {
        return await this.tfclient.applyExtrinsic(this.tfclient.client.createNameContract, [name], "smartContractModule", ["ContractCreated"]);
    }
    async createRentContract(nodeId) {
        return await this.tfclient.applyExtrinsic(this.tfclient.client.createRentContract, [nodeId], "smartContractModule", ["ContractCreated"]);
    }
    async activeRentContractForNode(nodeId) {
        return await this.tfclient.queryChain(this.tfclient.client.activeRentContractForNode, [nodeId]);
    }
    async updateNode(id, data, hash) {
        return await this.tfclient.applyExtrinsic(this.tfclient.client.updateNodeContract, [id, data, hash], "smartContractModule", ["ContractUpdated"]);
    }
    async cancel(id) {
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
    async get(id) {
        return await this.tfclient.queryChain(this.tfclient.client.getContractByID, [id]);
    }
    async getContractIdByNodeIdAndHash(nodeId, hash) {
        return await this.tfclient.queryChain(this.tfclient.client.contractIDByNodeIDAndHash, [nodeId, hash]);
    }
    async getNameContract(name) {
        return await this.tfclient.queryChain(this.tfclient.client.contractIDByNameRegistration, [name]);
    }
    async listContractsByTwinId(graphqlURL, twinId) {
        const gqlClient = new client_1.Graphql(graphqlURL);
        const options = `(where: {twinID_eq: ${twinId}, state_eq: Created}, orderBy: twinID_ASC)`;
        const nameContractsCount = await gqlClient.getItemTotalCount("nameContracts", options);
        const nodeContractsCount = await gqlClient.getItemTotalCount("nodeContracts", options);
        const rentContractsCount = await gqlClient.getItemTotalCount("rentContracts", options);
        const body = `query getContracts($nameContractsCount: Int!, $nodeContractsCount: Int!, $rentContractsCount: Int!){
            nameContracts(where: {twinID_eq: ${twinId}, state_eq: Created}, limit: $nameContractsCount) {
              contractID
            }
            nodeContracts(where: {twinID_eq: ${twinId}, state_eq: Created}, limit: $nodeContractsCount) {
              contractID
            }
            rentContracts(where: {twinID_eq: ${twinId}, state_eq: Created}, limit: $rentContractsCount) {
                contractID
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
    async getConsumption(id, graphqlURL) {
        const gqlClient = new client_1.Graphql(graphqlURL);
        const body = `query getConsumption($contractId: BigInt!){
            contractBillReports(where: {contractID_eq: $contractId}) {
                amountBilled
            }
          }`;
        const response = await gqlClient.query(body, { contractId: id });
        const billReports = response["data"]["contractBillReports"];
        if (billReports.length !== 0) {
            const amountBilled = new decimal_js_1.Decimal(billReports[billReports.length - 1]["amountBilled"]);
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
    async cancelMyContracts(graphqlURL) {
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
}
exports.Contracts = Contracts;
