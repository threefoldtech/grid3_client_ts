class Contracts {
    tfclient;

    constructor(client) {
        this.tfclient = client;
    }
    async createNode(nodeID: number, hash: string, data: string, publicIPs: number) {
        return this.tfclient.applyExtrinsic(
            this.tfclient.client.createNodeContract,
            [nodeID, data, hash, publicIPs],
            "smartContractModule",
            "ContractCreated",
        );
    }

    async createName(name: string) {
        return this.tfclient.applyExtrinsic(
            this.tfclient.client.createNameContract,
            [name],
            "smartContractModule",
            "ContractCreated",
        );
    }

    async updateNode(id: number, data: string, hash: string) {
        return this.tfclient.applyExtrinsic(
            this.tfclient.client.updateNodeContract,
            [id, data, hash],
            "smartContractModule",
            "ContractUpdated",
        );
    }

    async cancel(id: number) {
        return this.tfclient.applyExtrinsic(
            this.tfclient.client.cancelContract,
            [id],
            "smartContractModule",
            "ContractCanceled",
        );
    }

    async get(id: number) {
        return this.tfclient.client.getContractByID(id);
    }
}
export { Contracts };
