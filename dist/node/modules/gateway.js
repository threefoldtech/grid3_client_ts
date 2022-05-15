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
exports.gateway = void 0;
const expose_1 = require("../helpers/expose");
const validator_1 = require("../helpers/validator");
const gateway_1 = require("../high_level/gateway");
const workload_1 = require("../zos/workload");
const base_1 = require("./base");
const models_1 = require("./models");
const utils_1 = require("./utils");
class GWModule extends base_1.BaseModule {
    moduleName = "gateways";
    workloadTypes = [workload_1.WorkloadTypes.gatewayfqdnproxy, workload_1.WorkloadTypes.gatewaynameproxy];
    gateway;
    constructor(config) {
        super(config);
        this.gateway = new gateway_1.GatewayHL(config);
    }
    async deploy_fqdn(options) {
        if (await this.exists(options.name)) {
            throw Error(`Another gateway deployment with the same name ${options.name} already exists`);
        }
        const twinDeployments = await this.gateway.create(options.name, options.node_id, options.tls_passthrough, options.backends, options.fqdn);
        const contracts = await this.twinDeploymentHandler.handle(twinDeployments);
        await this.save(options.name, contracts);
        return { contracts: contracts };
    }
    async deploy_name(options) {
        if (await this.exists(options.name)) {
            throw Error(`Another gateway deployment with the same name ${options.name} already exists`);
        }
        const twinDeployments = await this.gateway.create(options.name, options.node_id, options.tls_passthrough, options.backends);
        const contracts = await this.twinDeploymentHandler.handle(twinDeployments);
        await this.save(options.name, contracts);
        return { contracts: contracts };
    }
    async list() {
        return await this._list();
    }
    async get_fqdn(options) {
        return await this._get(options.name);
    }
    async delete_fqdn(options) {
        return await this._delete(options.name);
    }
    async get_name(options) {
        return await this._get(options.name);
    }
    async delete_name(options) {
        return await this._delete(options.name);
    }
    async getObj(deploymentName) {
        const deployments = await this._get(deploymentName);
        const workloads = await this._getWorkloadsByTypes(deploymentName, deployments, [
            workload_1.WorkloadTypes.gatewayfqdnproxy,
            workload_1.WorkloadTypes.gatewaynameproxy,
        ]);
        return workloads.map(workload => {
            const data = workload.data;
            return {
                version: workload.version,
                contractId: workload["contractId"],
                name: workload.name,
                created: workload.result.created,
                status: workload.result.state,
                message: workload.result.message,
                type: workload.type,
                domain: workload.type === workload_1.WorkloadTypes.gatewayfqdnproxy
                    ? data.fqdn
                    : workload.result.data.fqdn,
                tls_passthrough: data.tls_passthrough,
                backends: data.backends,
                metadata: workload.metadata,
                description: workload.description,
            };
        });
    }
}
__decorate([
    expose_1.expose,
    validator_1.validateInput,
    utils_1.checkBalance,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [models_1.GatewayFQDNModel]),
    __metadata("design:returntype", Promise)
], GWModule.prototype, "deploy_fqdn", null);
__decorate([
    expose_1.expose,
    validator_1.validateInput,
    utils_1.checkBalance,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [models_1.GatewayNameModel]),
    __metadata("design:returntype", Promise)
], GWModule.prototype, "deploy_name", null);
__decorate([
    expose_1.expose,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], GWModule.prototype, "list", null);
__decorate([
    expose_1.expose,
    validator_1.validateInput,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [models_1.GatewayFQDNGetModel]),
    __metadata("design:returntype", Promise)
], GWModule.prototype, "get_fqdn", null);
__decorate([
    expose_1.expose,
    validator_1.validateInput,
    utils_1.checkBalance,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [models_1.GatewayFQDNDeleteModel]),
    __metadata("design:returntype", Promise)
], GWModule.prototype, "delete_fqdn", null);
__decorate([
    expose_1.expose,
    validator_1.validateInput,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [models_1.GatewayNameGetModel]),
    __metadata("design:returntype", Promise)
], GWModule.prototype, "get_name", null);
__decorate([
    expose_1.expose,
    validator_1.validateInput,
    utils_1.checkBalance,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [models_1.GatewayNameDeleteModel]),
    __metadata("design:returntype", Promise)
], GWModule.prototype, "delete_name", null);
exports.gateway = GWModule;
