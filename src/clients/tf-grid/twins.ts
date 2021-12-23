import { TFClient } from "./client";

class Twins {
    tfclient: TFClient;

    constructor(client: TFClient) {
        this.tfclient = client;
    }

    async create(ip: string) {
        return this.tfclient.applyExtrinsic(this.tfclient.client.createTwin, [ip], "tfgridModule", ["TwinStored"]);
    }

    async get(id: number) {
        return await this.tfclient.queryChain(this.tfclient.client.getTwinByID, [id]);
    }

    async getMyTwinId(): Promise<number> {
        await this.tfclient.connect();
        const pubKey = this.tfclient.client.address;
        return this.getTwinIdByAccountId(pubKey);
    }

    async getTwinIdByAccountId(publicKey: string): Promise<number> {
        return await this.tfclient.queryChain(this.tfclient.client.getTwinIdByAccountId, [publicKey]);
    }

    async list() {
        return await this.tfclient.queryChain(this.tfclient.client.listTwins, []);
    }

    async delete(id: number) {
        return this.tfclient.applyExtrinsic(this.tfclient.client.deleteTwin, [id], "tfgridModule", ["TwinDeleted"]);
    }
}

export { Twins };
