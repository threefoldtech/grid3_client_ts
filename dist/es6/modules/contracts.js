var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as PATH from "path";
import { TFClient } from "../clients/tf-grid/client";
import { events } from "../helpers/events";
import { expose } from "../helpers/expose";
import { validateInput } from "../helpers/validator";
import { Nodes } from "../primitives/nodes";
import { BaseModule } from "./base";
import { ContractCancelModel, ContractConsumption, ContractGetByNodeIdAndHashModel, ContractGetModel, ContractsByAddress, ContractsByTwinId, NameContractCreateModel, NameContractGetModel, NodeContractCreateModel, NodeContractUpdateModel, } from "./models";
import { checkBalance } from "./utils";
class Contracts {
    constructor(config) {
        this.config = config;
        this.client = new TFClient(config.substrateURL, config.mnemonic, config.storeSecret, config.keypairType);
        this.nodes = new Nodes(config.graphqlURL, config.rmbClient["proxyURL"]);
    }
    invalidateDeployment(contractId) {
        return __awaiter(this, void 0, void 0, function* () {
            const baseModule = new BaseModule(this.config);
            const contractPath = PATH.join(this.config.storePath, "contracts", `${contractId}.json`);
            let contractInfo;
            try {
                contractInfo = yield baseModule.backendStorage.load(contractPath);
            }
            catch (e) {
                events.emit("logs", `Couldn't delete the deployment's cached data for contract id: ${contractId} due to ${e}`);
            }
            if (contractInfo) {
                baseModule.moduleName = contractInfo["moduleName"];
                baseModule.projectName = contractInfo["projectName"];
                yield baseModule._get(contractInfo["deploymentName"]);
            }
        });
    }
    create_node(options) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.client.contracts.createNode(options.node_id, options.hash, options.data, options.public_ip);
        });
    }
    create_name(options) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.client.contracts.createName(options.name);
        });
    }
    get(options) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.client.contracts.get(options.id);
        });
    }
    get_contract_id_by_node_id_and_hash(options) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.client.contracts.getContractIdByNodeIdAndHash(options.node_id, options.hash);
        });
    }
    get_name_contract(options) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.client.contracts.getNameContract(options.name);
        });
    }
    update_node(options) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.client.contracts.updateNode(options.id, options.data, options.hash);
        });
    }
    cancel(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const deletedContract = yield this.client.contracts.cancel(options.id);
            yield this.invalidateDeployment(options.id);
            return deletedContract;
        });
    }
    listMyContracts() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.client.contracts.listMyContracts(this.config.graphqlURL);
        });
    }
    listContractsByTwinId(options) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.client.contracts.listContractsByTwinId(this.config.graphqlURL, options.twinId);
        });
    }
    listContractsByAddress(options) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.client.contracts.listContractsByAddress(this.config.graphqlURL, options.address);
        });
    }
    /**
     * WARNING: Please be careful when executing this method, it will delete all your contracts.
     * @returns Promise
     */
    cancelMyContracts() {
        return __awaiter(this, void 0, void 0, function* () {
            const contracts = yield this.client.contracts.cancelMyContracts(this.config.graphqlURL);
            for (const contract of contracts) {
                yield this.invalidateDeployment(contract.contractId);
            }
            return contracts;
        });
    }
    /**
     * Get contract consumption per hour in TFT.
     *
     * @param  {ContractConsumption} options
     * @returns {Promise<number>}
     */
    getConsumption(options) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.client.contracts.getConsumption(options.id, this.config.graphqlURL);
        });
    }
}
__decorate([
    expose,
    validateInput,
    checkBalance,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [NodeContractCreateModel]),
    __metadata("design:returntype", Promise)
], Contracts.prototype, "create_node", null);
__decorate([
    expose,
    validateInput,
    checkBalance,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [NameContractCreateModel]),
    __metadata("design:returntype", Promise)
], Contracts.prototype, "create_name", null);
__decorate([
    expose,
    validateInput,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ContractGetModel]),
    __metadata("design:returntype", Promise)
], Contracts.prototype, "get", null);
__decorate([
    expose,
    validateInput,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ContractGetByNodeIdAndHashModel]),
    __metadata("design:returntype", Promise)
], Contracts.prototype, "get_contract_id_by_node_id_and_hash", null);
__decorate([
    expose,
    validateInput,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [NameContractGetModel]),
    __metadata("design:returntype", Promise)
], Contracts.prototype, "get_name_contract", null);
__decorate([
    expose,
    validateInput,
    checkBalance,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [NodeContractUpdateModel]),
    __metadata("design:returntype", Promise)
], Contracts.prototype, "update_node", null);
__decorate([
    expose,
    validateInput,
    checkBalance,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ContractCancelModel]),
    __metadata("design:returntype", Promise)
], Contracts.prototype, "cancel", null);
__decorate([
    expose,
    validateInput,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], Contracts.prototype, "listMyContracts", null);
__decorate([
    expose,
    validateInput,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ContractsByTwinId]),
    __metadata("design:returntype", Promise)
], Contracts.prototype, "listContractsByTwinId", null);
__decorate([
    expose,
    validateInput,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ContractsByAddress]),
    __metadata("design:returntype", Promise)
], Contracts.prototype, "listContractsByAddress", null);
__decorate([
    expose,
    validateInput,
    checkBalance,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], Contracts.prototype, "cancelMyContracts", null);
__decorate([
    expose,
    validateInput,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ContractConsumption]),
    __metadata("design:returntype", Promise)
], Contracts.prototype, "getConsumption", null);
export { Contracts as contracts };
