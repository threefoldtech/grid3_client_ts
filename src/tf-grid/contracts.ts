class Contracts {
    tfclient: any;

    constructor(client) {
        this.tfclient = client;
    }
    async create(nodeID, hash, data, publicIPs) {
        return await this.tfclient.applyExtrinsic(this.tfclient.client.createContract, [nodeID, data, hash, publicIPs], "smartContractModule", "ContractCreated")
    }

    async update(id, data, hash) {
        return await this.tfclient.applyExtrinsic(this.tfclient.client.updateContract, [id, data, hash], "smartContractModule", "ContractUpdated")
    }

    async cancel(id) {
        return await this.tfclient.applyExtrinsic(this.tfclient.client.cancelContract, [id], "smartContractModule", "ContractCanceled")
    }

    async get(id) {
        return await this.tfclient.client.getContractByID(id)
    }
}
export { Contracts }
