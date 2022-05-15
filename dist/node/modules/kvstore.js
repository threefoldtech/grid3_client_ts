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
exports.kvstore = void 0;
const client_1 = require("../clients/tf-grid/client");
const expose_1 = require("../helpers/expose");
const validator_1 = require("../helpers/validator");
const models_1 = require("./models");
const utils_1 = require("./utils");
class KVStore {
    client;
    constructor(config) {
        this.client = new client_1.TFClient(config.substrateURL, config.mnemonic, config.storeSecret, config.keypairType);
    }
    async set(options) {
        return await this.client.kvStore.set(options.key, options.value);
    }
    async get(options) {
        return await this.client.kvStore.get(options.key);
    }
    async list() {
        return await this.client.kvStore.list();
    }
    async remove(options) {
        return await this.client.kvStore.remove(options.key);
    }
    async removeAll() {
        return await this.client.kvStore.removeAll();
    }
}
__decorate([
    expose_1.expose,
    validator_1.validateInput,
    utils_1.checkBalance,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [models_1.KVStoreSetModel]),
    __metadata("design:returntype", Promise)
], KVStore.prototype, "set", null);
__decorate([
    expose_1.expose,
    validator_1.validateInput,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [models_1.KVStoreGetModel]),
    __metadata("design:returntype", Promise)
], KVStore.prototype, "get", null);
__decorate([
    expose_1.expose,
    validator_1.validateInput,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], KVStore.prototype, "list", null);
__decorate([
    expose_1.expose,
    validator_1.validateInput,
    utils_1.checkBalance,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [models_1.KVStoreRemoveModel]),
    __metadata("design:returntype", Promise)
], KVStore.prototype, "remove", null);
__decorate([
    expose_1.expose,
    validator_1.validateInput,
    utils_1.checkBalance,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], KVStore.prototype, "removeAll", null);
exports.kvstore = KVStore;
