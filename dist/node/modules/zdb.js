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
exports.zdbs = void 0;
const expose_1 = require("../helpers/expose");
const validator_1 = require("../helpers/validator");
const zdb_1 = require("../high_level/zdb");
const workload_1 = require("../zos/workload");
const base_1 = require("./base");
const models_1 = require("./models");
const utils_1 = require("./utils");
class ZdbsModule extends base_1.BaseModule {
    fileName = "zdbs.json";
    workloadTypes = [workload_1.WorkloadTypes.zdb];
    zdb;
    constructor(config) {
        super(config);
        this.zdb = new zdb_1.ZdbHL(config);
    }
    async _createDeployment(options) {
        const twinDeployments = [];
        for (const instance of options.zdbs) {
            const twinDeployment = await this.zdb.create(instance.name, instance.node_id, instance.disk_size, instance.mode, instance.password, instance.publicNamespace, options.metadata, options.description);
            twinDeployments.push(twinDeployment);
        }
        return twinDeployments;
    }
    async deploy(options) {
        if (await this.exists(options.name)) {
            throw Error(`Another zdb deployment with the same name ${options.name} already exists`);
        }
        const twinDeployments = await this._createDeployment(options);
        const contracts = await this.twinDeploymentHandler.handle(twinDeployments);
        await this.save(options.name, contracts);
        return { contracts: contracts };
    }
    async list() {
        return await this._list();
    }
    async getObj(deploymentName) {
        const deployments = await this._get(deploymentName);
        const workloads = await this._getWorkloadsByTypes(deploymentName, deployments, [workload_1.WorkloadTypes.zdb]);
        const ret = [];
        for (const workload of workloads) {
            const data = workload.data;
            ret.push({
                version: workload.version,
                contractId: workload["contractId"],
                nodeId: workload["nodeId"],
                name: workload.name,
                created: workload.result.created,
                status: workload.result.state,
                message: workload.result.message,
                size: data.size,
                mode: data.mode,
                publicNamespace: data.public,
                password: data.password,
                metadata: workload.metadata,
                description: workload.description,
                resData: workload.result.data,
            });
        }
        return ret;
    }
    async get(options) {
        return await this._get(options.name);
    }
    async delete(options) {
        return await this._delete(options.name);
    }
    async update(options) {
        if (!(await this.exists(options.name))) {
            throw Error(`There is no zdb deployment with name: ${options.name}`);
        }
        const oldDeployments = await this._get(options.name);
        const twinDeployments = await this._createDeployment(options);
        return await this._update(this.zdb, options.name, oldDeployments, twinDeployments);
    }
    async add_zdb(options) {
        if (!(await this.exists(options.deployment_name))) {
            throw Error(`There is no zdb deployment with name: ${options.deployment_name}`);
        }
        const oldDeployments = await this._get(options.deployment_name);
        const twinDeployment = await this.zdb.create(options.name, options.node_id, options.disk_size, options.mode, options.password, options.publicNamespace, oldDeployments[0].metadata, oldDeployments[0].metadata);
        return await this._add(options.deployment_name, options.node_id, oldDeployments, [twinDeployment]);
    }
    async delete_zdb(options) {
        if (!(await this.exists(options.deployment_name))) {
            throw Error(`There is no zdb deployment with name: ${options.deployment_name}`);
        }
        return await this._deleteInstance(this.zdb, options.deployment_name, options.name);
    }
}
__decorate([
    expose_1.expose,
    validator_1.validateInput,
    utils_1.checkBalance,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [models_1.ZDBSModel]),
    __metadata("design:returntype", Promise)
], ZdbsModule.prototype, "deploy", null);
__decorate([
    expose_1.expose,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ZdbsModule.prototype, "list", null);
__decorate([
    expose_1.expose,
    validator_1.validateInput,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [models_1.ZDBGetModel]),
    __metadata("design:returntype", Promise)
], ZdbsModule.prototype, "get", null);
__decorate([
    expose_1.expose,
    validator_1.validateInput,
    utils_1.checkBalance,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [models_1.ZDBDeleteModel]),
    __metadata("design:returntype", Promise)
], ZdbsModule.prototype, "delete", null);
__decorate([
    expose_1.expose,
    validator_1.validateInput,
    utils_1.checkBalance,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [models_1.ZDBSModel]),
    __metadata("design:returntype", Promise)
], ZdbsModule.prototype, "update", null);
__decorate([
    expose_1.expose,
    validator_1.validateInput,
    utils_1.checkBalance,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [models_1.AddZDBModel]),
    __metadata("design:returntype", Promise)
], ZdbsModule.prototype, "add_zdb", null);
__decorate([
    expose_1.expose,
    validator_1.validateInput,
    utils_1.checkBalance,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [models_1.DeleteZDBModel]),
    __metadata("design:returntype", Promise)
], ZdbsModule.prototype, "delete_zdb", null);
exports.zdbs = ZdbsModule;
