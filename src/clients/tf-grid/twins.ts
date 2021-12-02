class Twins {
    tfclient;

    constructor(client) {
        this.tfclient = client;
    }

    async create(ip: string) {
        await this.tfclient.connect();
        return this.tfclient.applyExtrinsic(this.tfclient.client.createTwin, [ip], "tfgridModule", ["TwinStored"]);
    }

    async get(id: number) {
        await this.tfclient.connect();
        return this.tfclient.client.getTwinByID(id);
    }

    async getMyTwinId(): Promise<number> {
        await this.tfclient.connect();
        const pubKey = this.tfclient.client.address;
        return this.getTwinIdByAccountId(pubKey);
    }

    async getTwinIdByAccountId(publicKey: string): Promise<number> {
        await this.tfclient.connect();
        return this.tfclient.client.getTwinIdByAccountId(publicKey);
    }

    async list() {
        await this.tfclient.connect();
        return this.tfclient.client.listTwins();
    }

    async delete(id: number) {
        await this.tfclient.connect();
        return this.tfclient.applyExtrinsic(this.tfclient.client.deleteTwin, [id], "tfgridModule", ["TwinDeleted"]);
    }
}

export { Twins };
