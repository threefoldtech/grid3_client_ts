
class Twins {
    client: any;

    constructor(client) {
        this.client = client;
    }
    async create(ip, callback) {
        return await this.client.createTwin(ip, callback)
    }

    async get(id) {
        const twin = await this.client.getTwinByID(id)
        return twin
    }

    async list() {
        const twins = await this.client.listTwins()
        return twins
    }

    async delete(id, callback) {
        return await this.client.deleteTwin(id, callback)
    }

    async createTwinEntity(twinID, entityID, signature, callback) {
        return await this.client.addTwinEntity(twinID, entityID, signature, callback)
    }

    async deleteTwinEntity(twinID, entityID, callback) {

        return await this.client.removeTwinEntity(twinID, entityID, callback)
    }
}

export { Twins }