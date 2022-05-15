"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Twins = void 0;
class Twins {
    tfclient;
    constructor(client) {
        this.tfclient = client;
    }
    async create(ip) {
        return this.tfclient.applyExtrinsic(this.tfclient.client.createTwin, [ip], "tfgridModule", ["TwinStored"]);
    }
    async get(id) {
        return await this.tfclient.queryChain(this.tfclient.client.getTwinByID, [id]);
    }
    async getMyTwinId() {
        await this.tfclient.connect();
        const pubKey = this.tfclient.client.address;
        return this.getTwinIdByAccountId(pubKey);
    }
    async getTwinIdByAccountId(publicKey) {
        return await this.tfclient.queryChain(this.tfclient.client.getTwinIdByAccountId, [publicKey]);
    }
    async list() {
        return await this.tfclient.queryChain(this.tfclient.client.listTwins, []);
    }
    async delete(id) {
        return this.tfclient.applyExtrinsic(this.tfclient.client.deleteTwin, [id], "tfgridModule", ["TwinDeleted"]);
    }
}
exports.Twins = Twins;
