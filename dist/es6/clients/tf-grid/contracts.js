var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Decimal } from "decimal.js";
import { Graphql } from "../graphql/client";
class Contracts {
    constructor(client) {
        this.tfclient = client;
    }
    createNode(nodeID, hash, data, publicIPs) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.tfclient.applyExtrinsic(this.tfclient.client.createNodeContract, [nodeID, data, hash, publicIPs], "smartContractModule", ["ContractCreated"]);
        });
    }
    createName(name) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.tfclient.applyExtrinsic(this.tfclient.client.createNameContract, [name], "smartContractModule", ["ContractCreated"]);
        });
    }
    createRentContract(nodeId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.tfclient.applyExtrinsic(this.tfclient.client.createRentContract, [nodeId], "smartContractModule", ["ContractCreated"]);
        });
    }
    activeRentContractForNode(nodeId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.tfclient.queryChain(this.tfclient.client.activeRentContractForNode, [nodeId]);
        });
    }
    updateNode(id, data, hash) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.tfclient.applyExtrinsic(this.tfclient.client.updateNodeContract, [id, data, hash], "smartContractModule", ["ContractUpdated"]);
        });
    }
    cancel(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const contract = yield this.get(id);
            if (Object.keys(contract.state).includes("deleted")) {
                return id;
            }
            return yield this.tfclient.applyExtrinsic(this.tfclient.client.cancelContract, [id], "smartContractModule", [
                "NodeContractCanceled",
                "NameContractCanceled",
                "RentContractCanceled",
                "ContractCanceled",
            ]);
        });
    }
    get(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.tfclient.queryChain(this.tfclient.client.getContractByID, [id]);
        });
    }
    getContractIdByNodeIdAndHash(nodeId, hash) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.tfclient.queryChain(this.tfclient.client.contractIDByNodeIDAndHash, [nodeId, hash]);
        });
    }
    getNameContract(name) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.tfclient.queryChain(this.tfclient.client.contractIDByNameRegistration, [name]);
        });
    }
    listContractsByTwinId(graphqlURL, twinId) {
        return __awaiter(this, void 0, void 0, function* () {
            const gqlClient = new Graphql(graphqlURL);
            const options = `(where: {twinID_eq: ${twinId}, state_eq: Created}, orderBy: twinID_ASC)`;
            const nameContractsCount = yield gqlClient.getItemTotalCount("nameContracts", options);
            const nodeContractsCount = yield gqlClient.getItemTotalCount("nodeContracts", options);
            const rentContractsCount = yield gqlClient.getItemTotalCount("rentContracts", options);
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
            const response = yield gqlClient.query(body, {
                nodeContractsCount: nodeContractsCount,
                nameContractsCount: nameContractsCount,
                rentContractsCount: rentContractsCount,
            });
            return response["data"];
        });
    }
    /**
     * Get contract consumption per hour in TFT.
     *
     * @param  {number} id
     * @param  {string} graphqlURL
     * @returns {Promise<number>}
     */
    getConsumption(id, graphqlURL) {
        return __awaiter(this, void 0, void 0, function* () {
            const gqlClient = new Graphql(graphqlURL);
            const body = `query getConsumption($contractId: BigInt!){
            contractBillReports(where: {contractID_eq: $contractId}) {
                amountBilled
            }
          }`;
            const response = yield gqlClient.query(body, { contractId: id });
            const billReports = response["data"]["contractBillReports"];
            if (billReports.length !== 0) {
                const amountBilled = new Decimal(billReports[billReports.length - 1]["amountBilled"]);
                return amountBilled.div(Math.pow(10, 7)).toNumber();
            }
            return 0;
        });
    }
    listContractsByAddress(graphqlURL, address) {
        return __awaiter(this, void 0, void 0, function* () {
            const twinId = yield this.tfclient.twins.getTwinIdByAccountId(address);
            return yield this.listContractsByTwinId(graphqlURL, twinId);
        });
    }
    listMyContracts(graphqlURL) {
        return __awaiter(this, void 0, void 0, function* () {
            const twinId = yield this.tfclient.twins.getMyTwinId();
            return yield this.listContractsByTwinId(graphqlURL, twinId);
        });
    }
    /**
     * WARNING: Please be careful when executing this method, it will delete all your contracts.
     * @param  {string} graphqlURL
     * @returns Promise
     */
    cancelMyContracts(graphqlURL) {
        return __awaiter(this, void 0, void 0, function* () {
            const allContracts = yield this.listMyContracts(graphqlURL);
            const contracts = [
                ...allContracts["nameContracts"],
                ...allContracts["nodeContracts"],
                ...allContracts["rentContracts"],
            ];
            for (const contract of contracts) {
                yield this.cancel(contract["contractID"]);
            }
            return contracts;
        });
    }
}
export { Contracts };
