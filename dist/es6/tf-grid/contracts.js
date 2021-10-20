var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class Contracts {
    constructor(client) {
        this.tfclient = client;
    }
    createNode(nodeID, hash, data, publicIPs) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.tfclient.applyExtrinsic(this.tfclient.client.createNodeContract, [nodeID, data, hash, publicIPs], "smartContractModule", "ContractCreated");
        });
    }
    createName(name) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.tfclient.applyExtrinsic(this.tfclient.client.createNameContract, [name], "smartContractModule", "ContractCreated");
        });
    }
    updateNode(id, data, hash) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.tfclient.applyExtrinsic(this.tfclient.client.updateNodeContract, [id, data, hash], "smartContractModule", "ContractUpdated");
        });
    }
    cancel(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.tfclient.applyExtrinsic(this.tfclient.client.cancelContract, [id], "smartContractModule", "ContractCanceled");
        });
    }
    get(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.tfclient.client.getContractByID(id);
        });
    }
}
export { Contracts };
