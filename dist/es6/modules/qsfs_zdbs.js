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
import { ZdbBackend } from "../zos/qsfs";
import { WorkloadTypes } from "../zos/workload";
import { ZdbModes } from "../zos/zdb";
import { BaseModule } from "./base";
import { QSFSZDBDeleteModel, QSFSZDBGetModel, QSFSZDBSModel } from "./models";
import { checkBalance } from "./utils";
class QSFSZdbsModule extends BaseModule {
    constructor(config) {
        super(config);
        this.moduleName = "qsfs_zdbs";
        this.workloadTypes = [WorkloadTypes.zdb];
        this.zdb = new ZdbHL(config);
    }
    _createDeployment(options) {
        return __awaiter(this, void 0, void 0, function* () {
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
                const twinDeployment = yield this.zdb.create(options.name + i, nodeId, options.disk_size, mode, options.password, true, options.metadata, options.description);
                twinDeployments.push(twinDeployment);
            }
            return twinDeployments;
        });
    }
    deploy(options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (yield this.exists(options.name)) {
                throw Error(`Another QSFS zdbs deployment with the same name ${options.name} already exists`);
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
    getZdbs(name) {
        return __awaiter(this, void 0, void 0, function* () {
            const deployments = yield this._get(name);
            const zdbs = [];
            for (const deployment of deployments) {
                for (const workload of deployment.workloads) {
                    if (workload.type !== WorkloadTypes.zdb) {
                        continue;
                    }
                    workload["contractId"] = deployment.contract_id;
                    workload["nodeId"] = yield this._getNodeIdFromContractId(name, deployment.contract_id);
                    zdbs.push(workload);
                }
            }
            const qsfsZdbs = { meta: [], groups: [] };
            for (const zdb of zdbs) {
                const zdbBackend = new ZdbBackend();
                zdbBackend.namespace = zdb.result.data.Namespace;
                zdbBackend.password = zdb.data.password;
                zdbBackend.address = `[${zdb.result.data.IPs[1]}]:${zdb.result.data.Port}`;
                zdbBackend["contractId"] = zdb["contractId"];
                zdbBackend["nodeId"] = zdb["nodeId"];
                if (zdb.data.mode === ZdbModes.user) {
                    qsfsZdbs.meta.push(zdbBackend);
                }
                else {
                    qsfsZdbs.groups.push(zdbBackend);
                }
            }
            return qsfsZdbs;
        });
    }
}
__decorate([
    expose,
    validateInput,
    checkBalance,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [QSFSZDBSModel]),
    __metadata("design:returntype", Promise)
], QSFSZdbsModule.prototype, "deploy", null);
__decorate([
    expose,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], QSFSZdbsModule.prototype, "list", null);
__decorate([
    expose,
    validateInput,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [QSFSZDBGetModel]),
    __metadata("design:returntype", Promise)
], QSFSZdbsModule.prototype, "get", null);
__decorate([
    expose,
    validateInput,
    checkBalance,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [QSFSZDBDeleteModel]),
    __metadata("design:returntype", Promise)
], QSFSZdbsModule.prototype, "delete", null);
export { QSFSZdbsModule as qsfs_zdbs };
