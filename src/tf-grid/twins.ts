class Twins {
    tfclient: any;

    constructor(client) {
        this.tfclient = client;
    }

    async create(ip) {
        return await this.tfclient.applyExtrinsic(this.tfclient.client.createTwin, [ip], "tfgridModule", "TwinStored")
    }

    async get(id) {
        const twin = await this.tfclient.client.getTwinByID(id)
        return twin
    }

    async list() {
        const twins = await this.tfclient.client.listTwins()
        return twins
    }

    async delete(id) {
        return await this.tfclient.applyExtrinsic(this.tfclient.client.deleteTwin, [id], "tfgridModule", "TwinDeleted")
    }

}

export { Twins }