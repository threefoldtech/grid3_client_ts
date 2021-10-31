class Twins {
    tfclient;

    constructor(client) {
        this.tfclient = client;
    }

    async create(ip: string) {
        return this.tfclient.applyExtrinsic(this.tfclient.client.createTwin, [ip], "tfgridModule", "TwinStored");
    }

    async get(id: number) {
        return this.tfclient.client.getTwinByID(id);
    }

    async getMyTwinId(): Promise<number> {
        const pubKey = this.tfclient.client.key.address;
        return await this.getTwinIdByAccountId(pubKey);
    }

    async getTwinIdByAccountId(publicKey: string): Promise<number> {
        return await this.tfclient.client.getTwinIdByAccountId(publicKey);
    }

    async list() {
        return this.tfclient.client.listTwins();
    }

    async delete(id: number) {
        return this.tfclient.applyExtrinsic(this.tfclient.client.deleteTwin, [id], "tfgridModule", "TwinDeleted");
    }
}

export { Twins };
