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
exports.twins = void 0;
const client_1 = require("../clients/tf-grid/client");
const expose_1 = require("../helpers/expose");
const validator_1 = require("../helpers/validator");
const models_1 = require("./models");
const utils_1 = require("./utils");
class Twins {
    client;
    constructor(config) {
        this.client = new client_1.TFClient(config.substrateURL, config.mnemonic, config.storeSecret, config.keypairType);
    }
    async create(options) {
        return await this.client.twins.create(options.ip);
    }
    async get(options) {
        return await this.client.twins.get(options.id);
    }
    async get_my_twin_id() {
        return await this.client.twins.getMyTwinId();
    }
    async get_twin_id_by_account_id(options) {
        return await this.client.twins.getTwinIdByAccountId(options.public_key);
    }
    async list() {
        return await this.client.twins.list();
    }
    async delete(options) {
        return await this.client.twins.delete(options.id);
    }
}
__decorate([
    expose_1.expose,
    validator_1.validateInput,
    utils_1.checkBalance,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [models_1.TwinCreateModel]),
    __metadata("design:returntype", Promise)
], Twins.prototype, "create", null);
__decorate([
    expose_1.expose,
    validator_1.validateInput,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [models_1.TwinGetModel]),
    __metadata("design:returntype", Promise)
], Twins.prototype, "get", null);
__decorate([
    expose_1.expose,
    validator_1.validateInput,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], Twins.prototype, "get_my_twin_id", null);
__decorate([
    expose_1.expose,
    validator_1.validateInput,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [models_1.TwinGetByAccountIdModel]),
    __metadata("design:returntype", Promise)
], Twins.prototype, "get_twin_id_by_account_id", null);
__decorate([
    expose_1.expose,
    validator_1.validateInput,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], Twins.prototype, "list", null);
__decorate([
    expose_1.expose,
    validator_1.validateInput,
    utils_1.checkBalance,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [models_1.TwinDeleteModel]),
    __metadata("design:returntype", Promise)
], Twins.prototype, "delete", null);
exports.twins = Twins;
