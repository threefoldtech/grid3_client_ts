class Twins {
    tfclient: any;

    constructor(client) {
        this.tfclient = client;
    }

    async create(ip) {
        return this.tfclient.applyExtrinsic(this.tfclient.client.createTwin, [ip], "tfgridModule", "TwinStored");
    }

    async get(id) {
        return this.tfclient.client.getTwinByID(id);
    }

    async list() {
        return this.tfclient.client.listTwins();
    }

    async delete(id) {
        return this.tfclient.applyExtrinsic(this.tfclient.client.deleteTwin, [id], "tfgridModule", "TwinDeleted");
    }
}

export { Twins };
