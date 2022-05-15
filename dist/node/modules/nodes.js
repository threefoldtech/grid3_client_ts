"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.nodes = void 0;
const clients_1 = require("../clients");
const helpers_1 = require("../helpers");
const expose_1 = require("../helpers/expose");
const models_1 = require("./models");
const utils_1 = require("./utils");
class Nodes {
    config;
    client;
    constructor(config) {
        this.config = config;
        this.client = new clients_1.TFClient(config.substrateURL, config.mnemonic, config.storeSecret, config.keypairType);
    }
    async reserve(options) {
        const rentContract = await this.getRent({ nodeId: options.nodeId });
        if (rentContract.contract_id != 0) {
            throw Error(`Node Already rented by user with twinId ${rentContract.twin_id}`);
        }
        try {
            const res = await this.client.contracts.createRentContract(options.nodeId);
            helpers_1.events.emit("logs", `Rent contract with id: ${res["contract_id"]} has been created`);
            return res;
        }
        catch (e) {
            throw Error(`Failed to create rent contract on node ${options.nodeId} due to ${e}`);
        }
    }
    async unreserve(options) {
        const rentContract = await this.getRent({ nodeId: options.nodeId });
        if (rentContract.contract_id === 0) {
            helpers_1.events.emit("logs", `No rent contract found for node ${options.nodeId}`);
            return rentContract;
        }
        try {
            const res = await this.client.contracts.cancel(rentContract.contract_id);
            helpers_1.events.emit("logs", `Rent contract for node ${options.nodeId} has been deleted`);
            return res;
        }
        catch (e) {
            throw Error(`Failed to delete rent contract on node ${options.nodeId} due to ${e}`);
        }
    }
    async getRent(options) {
        return await this.client.contracts.activeRentContractForNode(options.nodeId);
    }
}
__decorate([
    expose_1.expose,
    helpers_1.validateInput,
    utils_1.checkBalance,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [models_1.RentContractCreateModel]),
    __metadata("design:returntype", Promise)
], Nodes.prototype, "reserve", null);
__decorate([
    expose_1.expose,
    helpers_1.validateInput,
    utils_1.checkBalance,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [models_1.RentContractDeleteModel]),
    __metadata("design:returntype", Promise)
], Nodes.prototype, "unreserve", null);
__decorate([
    expose_1.expose,
    helpers_1.validateInput,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [models_1.RentContractGetModel]),
    __metadata("design:returntype", Promise)
], Nodes.prototype, "getRent", null);
exports.nodes = Nodes;
