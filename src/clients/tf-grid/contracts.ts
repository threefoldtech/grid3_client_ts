enum ContractState {
    Created = "Created",
    Deleted = "Deleted",
    OutOfFunds = "OutOfFunds",
}
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
            ["ContractCreated"],
        );
    }

    async createName(name: string) {
        return this.tfclient.applyExtrinsic(this.tfclient.client.createNameContract, [name], "smartContractModule", [
            "ContractCreated",
        ]);
    }

    async updateNode(id: number, data: string, hash: string) {
        return this.tfclient.applyExtrinsic(
            this.tfclient.client.updateNodeContract,
            [id, data, hash],
            "smartContractModule",
            ["ContractUpdated"],
        );
    }

    async cancel(id: number) {
        return this.tfclient.applyExtrinsic(this.tfclient.client.cancelContract, [id], "smartContractModule", [
            "NodeContractCanceled",
            "NameContractCanceled",
            "ContractCanceled",
        ]);
    }

    async get(id: number) {
        return this.tfclient.client.getContractByID(id);
    }

    async getContractIdByNodeIdAndHash(nodeId: number, hash: string) {
        return this.tfclient.client.contractIDByNodeIDAndHash(nodeId, hash);
    }

    async getNodeContracts(nodeId: number, state: ContractState) {
        return this.tfclient.client.nodeContracts(nodeId, state);
    }

    async getNameContract(name: string) {
        return this.tfclient.client.contractIDByNameRegistration(name);
    }
}

export { Contracts, ContractState };
