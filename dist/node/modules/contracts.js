"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.contracts = void 0;
const PATH = __importStar(require("path"));
const client_1 = require("../clients/tf-grid/client");
const events_1 = require("../helpers/events");
const expose_1 = require("../helpers/expose");
const validator_1 = require("../helpers/validator");
const nodes_1 = require("../primitives/nodes");
const base_1 = require("./base");
const models_1 = require("./models");
const utils_1 = require("./utils");
class Contracts {
    config;
    client;
    nodes;
    constructor(config) {
        this.config = config;
        this.client = new client_1.TFClient(config.substrateURL, config.mnemonic, config.storeSecret, config.keypairType);
        this.nodes = new nodes_1.Nodes(config.graphqlURL, config.rmbClient["proxyURL"]);
    }
    async invalidateDeployment(contractId) {
        const baseModule = new base_1.BaseModule(this.config);
        const contractPath = PATH.join(this.config.storePath, "contracts", `${contractId}.json`);
        let contractInfo;
        try {
            contractInfo = await baseModule.backendStorage.load(contractPath);
        }
        catch (e) {
            events_1.events.emit("logs", `Couldn't delete the deployment's cached data for contract id: ${contractId} due to ${e}`);
        }
        if (contractInfo) {
            baseModule.moduleName = contractInfo["moduleName"];
            baseModule.projectName = contractInfo["projectName"];
            await baseModule._get(contractInfo["deploymentName"]);
        }
    }
    async create_node(options) {
        return await this.client.contracts.createNode(options.node_id, options.hash, options.data, options.public_ip);
    }
    async create_name(options) {
        return await this.client.contracts.createName(options.name);
    }
    async get(options) {
        return await this.client.contracts.get(options.id);
    }
    async get_contract_id_by_node_id_and_hash(options) {
        return await this.client.contracts.getContractIdByNodeIdAndHash(options.node_id, options.hash);
    }
    async get_name_contract(options) {
        return await this.client.contracts.getNameContract(options.name);
    }
    async update_node(options) {
        return await this.client.contracts.updateNode(options.id, options.data, options.hash);
    }
    async cancel(options) {
        const deletedContract = await this.client.contracts.cancel(options.id);
        await this.invalidateDeployment(options.id);
        return deletedContract;
    }
    async listMyContracts() {
        return await this.client.contracts.listMyContracts(this.config.graphqlURL);
    }
    async listContractsByTwinId(options) {
        return await this.client.contracts.listContractsByTwinId(this.config.graphqlURL, options.twinId);
    }
    async listContractsByAddress(options) {
        return await this.client.contracts.listContractsByAddress(this.config.graphqlURL, options.address);
    }
    /**
     * WARNING: Please be careful when executing this method, it will delete all your contracts.
     * @returns Promise
     */
    async cancelMyContracts() {
        const contracts = await this.client.contracts.cancelMyContracts(this.config.graphqlURL);
        for (const contract of contracts) {
            await this.invalidateDeployment(contract.contractId);
        }
        return contracts;
    }
    /**
     * Get contract consumption per hour in TFT.
     *
     * @param  {ContractConsumption} options
     * @returns {Promise<number>}
     */
    async getConsumption(options) {
        return await this.client.contracts.getConsumption(options.id, this.config.graphqlURL);
    }
}
__decorate([
    expose_1.expose,
    validator_1.validateInput,
    utils_1.checkBalance,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [models_1.NodeContractCreateModel]),
    __metadata("design:returntype", Promise)
], Contracts.prototype, "create_node", null);
__decorate([
    expose_1.expose,
    validator_1.validateInput,
    utils_1.checkBalance,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [models_1.NameContractCreateModel]),
    __metadata("design:returntype", Promise)
], Contracts.prototype, "create_name", null);
__decorate([
    expose_1.expose,
    validator_1.validateInput,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [models_1.ContractGetModel]),
    __metadata("design:returntype", Promise)
], Contracts.prototype, "get", null);
__decorate([
    expose_1.expose,
    validator_1.validateInput,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [models_1.ContractGetByNodeIdAndHashModel]),
    __metadata("design:returntype", Promise)
], Contracts.prototype, "get_contract_id_by_node_id_and_hash", null);
__decorate([
    expose_1.expose,
    validator_1.validateInput,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [models_1.NameContractGetModel]),
    __metadata("design:returntype", Promise)
], Contracts.prototype, "get_name_contract", null);
__decorate([
    expose_1.expose,
    validator_1.validateInput,
    utils_1.checkBalance,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [models_1.NodeContractUpdateModel]),
    __metadata("design:returntype", Promise)
], Contracts.prototype, "update_node", null);
__decorate([
    expose_1.expose,
    validator_1.validateInput,
    utils_1.checkBalance,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [models_1.ContractCancelModel]),
    __metadata("design:returntype", Promise)
], Contracts.prototype, "cancel", null);
__decorate([
    expose_1.expose,
    validator_1.validateInput,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], Contracts.prototype, "listMyContracts", null);
__decorate([
    expose_1.expose,
    validator_1.validateInput,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [models_1.ContractsByTwinId]),
    __metadata("design:returntype", Promise)
], Contracts.prototype, "listContractsByTwinId", null);
__decorate([
    expose_1.expose,
    validator_1.validateInput,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [models_1.ContractsByAddress]),
    __metadata("design:returntype", Promise)
], Contracts.prototype, "listContractsByAddress", null);
__decorate([
    expose_1.expose,
    validator_1.validateInput,
    utils_1.checkBalance,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], Contracts.prototype, "cancelMyContracts", null);
__decorate([
    expose_1.expose,
    validator_1.validateInput,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [models_1.ContractConsumption]),
    __metadata("design:returntype", Promise)
], Contracts.prototype, "getConsumption", null);
exports.contracts = Contracts;
