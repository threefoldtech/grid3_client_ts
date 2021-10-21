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

    async list() {
        return this.tfclient.client.listTwins();
    }

    async delete(id: number) {
        return this.tfclient.applyExtrinsic(this.tfclient.client.deleteTwin, [id], "tfgridModule", "TwinDeleted");
    }
}

export { Twins };
