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
exports.qsfs_zdbs = void 0;
const expose_1 = require("../helpers/expose");
const validator_1 = require("../helpers/validator");
const zdb_1 = require("../high_level/zdb");
const qsfs_1 = require("../zos/qsfs");
const workload_1 = require("../zos/workload");
const zdb_2 = require("../zos/zdb");
const base_1 = require("./base");
const models_1 = require("./models");
const utils_1 = require("./utils");
class QSFSZdbsModule extends base_1.BaseModule {
    moduleName = "qsfs_zdbs";
    workloadTypes = [workload_1.WorkloadTypes.zdb];
    zdb;
    constructor(config) {
        super(config);
        this.zdb = new zdb_1.ZdbHL(config);
    }
    async _createDeployment(options) {
        if (options.count < 3) {
            throw Error("QSFS zdbs count can't be less than 3");
        }
        const count = options.count + 4; // 4 zdbs for meta
        const twinDeployments = [];
        for (let i = 1; i <= count; i++) {
            let mode = "seq";
            if (i > options.count) {
                mode = "user";
            }
            const nodeId = options.node_ids[(i - 1) % options.node_ids.length];
            const twinDeployment = await this.zdb.create(options.name + i, nodeId, options.disk_size, mode, options.password, true, options.metadata, options.description);
            twinDeployments.push(twinDeployment);
        }
        return twinDeployments;
    }
    async deploy(options) {
        if (await this.exists(options.name)) {
            throw Error(`Another QSFS zdbs deployment with the same name ${options.name} already exists`);
        }
        const twinDeployments = await this._createDeployment(options);
        const contracts = await this.twinDeploymentHandler.handle(twinDeployments);
        await this.save(options.name, contracts);
        return { contracts: contracts };
    }
    async list() {
        return await this._list();
    }
    async get(options) {
        return await this._get(options.name);
    }
    async delete(options) {
        return await this._delete(options.name);
    }
    async getZdbs(name) {
        const deployments = await this._get(name);
        const zdbs = [];
        for (const deployment of deployments) {
            for (const workload of deployment.workloads) {
                if (workload.type !== workload_1.WorkloadTypes.zdb) {
                    continue;
                }
                workload["contractId"] = deployment.contract_id;
                workload["nodeId"] = await this._getNodeIdFromContractId(name, deployment.contract_id);
                zdbs.push(workload);
            }
        }
        const qsfsZdbs = { meta: [], groups: [] };
        for (const zdb of zdbs) {
            const zdbBackend = new qsfs_1.ZdbBackend();
            zdbBackend.namespace = zdb.result.data.Namespace;
            zdbBackend.password = zdb.data.password;
            zdbBackend.address = `[${zdb.result.data.IPs[1]}]:${zdb.result.data.Port}`;
            zdbBackend["contractId"] = zdb["contractId"];
            zdbBackend["nodeId"] = zdb["nodeId"];
            if (zdb.data.mode === zdb_2.ZdbModes.user) {
                qsfsZdbs.meta.push(zdbBackend);
            }
            else {
                qsfsZdbs.groups.push(zdbBackend);
            }
        }
        return qsfsZdbs;
    }
}
__decorate([
    expose_1.expose,
    validator_1.validateInput,
    utils_1.checkBalance,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [models_1.QSFSZDBSModel]),
    __metadata("design:returntype", Promise)
], QSFSZdbsModule.prototype, "deploy", null);
__decorate([
    expose_1.expose,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], QSFSZdbsModule.prototype, "list", null);
__decorate([
    expose_1.expose,
    validator_1.validateInput,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [models_1.QSFSZDBGetModel]),
    __metadata("design:returntype", Promise)
], QSFSZdbsModule.prototype, "get", null);
__decorate([
    expose_1.expose,
    validator_1.validateInput,
    utils_1.checkBalance,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [models_1.QSFSZDBDeleteModel]),
    __metadata("design:returntype", Promise)
], QSFSZdbsModule.prototype, "delete", null);
exports.qsfs_zdbs = QSFSZdbsModule;
