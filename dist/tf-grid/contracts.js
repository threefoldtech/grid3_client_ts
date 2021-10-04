"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Contracts = void 0;
class Contracts {
    tfclient;
    constructor(client) {
        this.tfclient = client;
    }
    async createNode(nodeID, hash, data, publicIPs) {
        return this.tfclient.applyExtrinsic(this.tfclient.client.createNodeContract, [nodeID, data, hash, publicIPs], "smartContractModule", "ContractCreated");
    }
    async createName(name) {
        return this.tfclient.applyExtrinsic(this.tfclient.client.createNameContract, [name], "smartContractModule", "ContractCreated");
    }
    async updateNode(id, data, hash) {
        return this.tfclient.applyExtrinsic(this.tfclient.client.updateNodeContract, [id, data, hash], "smartContractModule", "ContractUpdated");
    }
    async cancel(id) {
        return this.tfclient.applyExtrinsic(this.tfclient.client.cancelContract, [id], "smartContractModule", "ContractCanceled");
    }
    async get(id) {
        return this.tfclient.client.getContractByID(id);
    }
}
exports.Contracts = Contracts;
