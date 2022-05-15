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
import { expose } from "../helpers/expose";
import { validateInput } from "../helpers/validator";
import { ZdbHL } from "../high_level/zdb";
import { WorkloadTypes } from "../zos/workload";
import { BaseModule } from "./base";
import { AddZDBModel, DeleteZDBModel, ZDBDeleteModel, ZDBGetModel, ZDBSModel } from "./models";
import { checkBalance } from "./utils";
class ZdbsModule extends BaseModule {
    constructor(config) {
        super(config);
        this.fileName = "zdbs.json";
        this.workloadTypes = [WorkloadTypes.zdb];
        this.zdb = new ZdbHL(config);
    }
    _createDeployment(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const twinDeployments = [];
            for (const instance of options.zdbs) {
                const twinDeployment = yield this.zdb.create(instance.name, instance.node_id, instance.disk_size, instance.mode, instance.password, instance.publicNamespace, options.metadata, options.description);
                twinDeployments.push(twinDeployment);
            }
            return twinDeployments;
        });
    }
    deploy(options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (yield this.exists(options.name)) {
                throw Error(`Another zdb deployment with the same name ${options.name} already exists`);
            }
            const twinDeployments = yield this._createDeployment(options);
            const contracts = yield this.twinDeploymentHandler.handle(twinDeployments);
            yield this.save(options.name, contracts);
            return { contracts: contracts };
        });
    }
    list() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._list();
        });
    }
    getObj(deploymentName) {
        return __awaiter(this, void 0, void 0, function* () {
            const deployments = yield this._get(deploymentName);
            const workloads = yield this._getWorkloadsByTypes(deploymentName, deployments, [WorkloadTypes.zdb]);
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
        });
    }
    get(options) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._get(options.name);
        });
    }
    delete(options) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._delete(options.name);
        });
    }
    update(options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(yield this.exists(options.name))) {
                throw Error(`There is no zdb deployment with name: ${options.name}`);
            }
            const oldDeployments = yield this._get(options.name);
            const twinDeployments = yield this._createDeployment(options);
            return yield this._update(this.zdb, options.name, oldDeployments, twinDeployments);
        });
    }
    add_zdb(options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(yield this.exists(options.deployment_name))) {
                throw Error(`There is no zdb deployment with name: ${options.deployment_name}`);
            }
            const oldDeployments = yield this._get(options.deployment_name);
            const twinDeployment = yield this.zdb.create(options.name, options.node_id, options.disk_size, options.mode, options.password, options.publicNamespace, oldDeployments[0].metadata, oldDeployments[0].metadata);
            return yield this._add(options.deployment_name, options.node_id, oldDeployments, [twinDeployment]);
        });
    }
    delete_zdb(options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(yield this.exists(options.deployment_name))) {
                throw Error(`There is no zdb deployment with name: ${options.deployment_name}`);
            }
            return yield this._deleteInstance(this.zdb, options.deployment_name, options.name);
        });
    }
}
__decorate([
    expose,
    validateInput,
    checkBalance,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ZDBSModel]),
    __metadata("design:returntype", Promise)
], ZdbsModule.prototype, "deploy", null);
__decorate([
    expose,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ZdbsModule.prototype, "list", null);
__decorate([
    expose,
    validateInput,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ZDBGetModel]),
    __metadata("design:returntype", Promise)
], ZdbsModule.prototype, "get", null);
__decorate([
    expose,
    validateInput,
    checkBalance,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ZDBDeleteModel]),
    __metadata("design:returntype", Promise)
], ZdbsModule.prototype, "delete", null);
__decorate([
    expose,
    validateInput,
    checkBalance,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ZDBSModel]),
    __metadata("design:returntype", Promise)
], ZdbsModule.prototype, "update", null);
__decorate([
    expose,
    validateInput,
    checkBalance,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [AddZDBModel]),
    __metadata("design:returntype", Promise)
], ZdbsModule.prototype, "add_zdb", null);
__decorate([
    expose,
    validateInput,
    checkBalance,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [DeleteZDBModel]),
    __metadata("design:returntype", Promise)
], ZdbsModule.prototype, "delete_zdb", null);
export { ZdbsModule as zdbs };
