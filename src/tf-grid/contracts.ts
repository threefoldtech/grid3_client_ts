class Contracts {
    tfclient: any;

    constructor(client) {
        this.tfclient = client;
    }
    async create(nodeID, hash, data, publicIPs) {
        return this.tfclient.applyExtrinsic(this.tfclient.client.createContract, [nodeID, data, hash, publicIPs], "smartContractModule", "ContractCreated")
    }

    async update(id, data, hash) {
        return this.tfclient.applyExtrinsic(this.tfclient.client.updateContract, [id, data, hash], "smartContractModule", "ContractUpdated")
    }

    async cancel(id) {
        return this.tfclient.applyExtrinsic(this.tfclient.client.cancelContract, [id], "smartContractModule", "ContractCanceled")
    }

    async get(id) {
        return this.tfclient.client.getContractByID(id)
    }
}
export { Contracts }
