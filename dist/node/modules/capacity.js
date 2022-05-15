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
exports.capacity = void 0;
const expose_1 = require("../helpers/expose");
const validator_1 = require("../helpers/validator");
const nodes_1 = require("../primitives/nodes");
const models_1 = require("./models");
class Capacity {
    nodes;
    constructor(config) {
        this.nodes = new nodes_1.Nodes(config.graphqlURL, config.rmbClient["proxyURL"]);
    }
    async getFarms(options = {}) {
        return await this.nodes.getFarms(options.page, options.maxResult);
    }
    async getNodes(options = {}) {
        return await this.nodes.getNodes(options.page, options.maxResult);
    }
    async getAllFarms() {
        return await this.nodes.getAllFarms();
    }
    async getAllNodes() {
        return await this.nodes.getAllNodes();
    }
    async filterNodes(options) {
        return await this.nodes.filterNodes(options);
    }
    async checkFarmHasFreePublicIps(options) {
        return await this.nodes.checkFarmHasFreePublicIps(options.farmId);
    }
    async getNodesByFarmId(options) {
        return await this.nodes.getNodesByFarmId(options.farmId);
    }
    async getNodeFreeResources(options) {
        return await this.nodes.getNodeFreeResources(options.nodeId);
    }
    async getFarmIdFromFarmName(options) {
        return await this.nodes.getFarmIdFromFarmName(options.farmName);
    }
}
__decorate([
    expose_1.expose,
    validator_1.validateInput,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [models_1.FarmsGetModel]),
    __metadata("design:returntype", Promise)
], Capacity.prototype, "getFarms", null);
__decorate([
    expose_1.expose,
    validator_1.validateInput,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [models_1.NodesGetModel]),
    __metadata("design:returntype", Promise)
], Capacity.prototype, "getNodes", null);
__decorate([
    expose_1.expose,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], Capacity.prototype, "getAllFarms", null);
__decorate([
    expose_1.expose,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], Capacity.prototype, "getAllNodes", null);
__decorate([
    expose_1.expose,
    validator_1.validateInput,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [models_1.FilterOptions]),
    __metadata("design:returntype", Promise)
], Capacity.prototype, "filterNodes", null);
__decorate([
    expose_1.expose,
    validator_1.validateInput,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [models_1.FarmHasFreePublicIPsModel]),
    __metadata("design:returntype", Promise)
], Capacity.prototype, "checkFarmHasFreePublicIps", null);
__decorate([
    expose_1.expose,
    validator_1.validateInput,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [models_1.NodesByFarmIdModel]),
    __metadata("design:returntype", Promise)
], Capacity.prototype, "getNodesByFarmId", null);
__decorate([
    expose_1.expose,
    validator_1.validateInput,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [models_1.NodeFreeResourcesModel]),
    __metadata("design:returntype", Promise)
], Capacity.prototype, "getNodeFreeResources", null);
__decorate([
    expose_1.expose,
    validator_1.validateInput,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [models_1.FarmIdFromFarmNameModel]),
    __metadata("design:returntype", Promise)
], Capacity.prototype, "getFarmIdFromFarmName", null);
exports.capacity = Capacity;
