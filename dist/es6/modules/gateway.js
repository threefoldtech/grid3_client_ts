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
import { GatewayHL } from "../high_level/gateway";
import { WorkloadTypes } from "../zos/workload";
import { BaseModule } from "./base";
import { GatewayFQDNDeleteModel, GatewayFQDNGetModel, GatewayFQDNModel, GatewayNameDeleteModel, GatewayNameGetModel, GatewayNameModel, } from "./models";
import { checkBalance } from "./utils";
class GWModule extends BaseModule {
    constructor(config) {
        super(config);
        this.moduleName = "gateways";
        this.workloadTypes = [WorkloadTypes.gatewayfqdnproxy, WorkloadTypes.gatewaynameproxy];
        this.gateway = new GatewayHL(config);
    }
    deploy_fqdn(options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (yield this.exists(options.name)) {
                throw Error(`Another gateway deployment with the same name ${options.name} already exists`);
            }
            const twinDeployments = yield this.gateway.create(options.name, options.node_id, options.tls_passthrough, options.backends, options.fqdn);
            const contracts = yield this.twinDeploymentHandler.handle(twinDeployments);
            yield this.save(options.name, contracts);
            return { contracts: contracts };
        });
    }
    deploy_name(options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (yield this.exists(options.name)) {
                throw Error(`Another gateway deployment with the same name ${options.name} already exists`);
            }
            const twinDeployments = yield this.gateway.create(options.name, options.node_id, options.tls_passthrough, options.backends);
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
    get_fqdn(options) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._get(options.name);
        });
    }
    delete_fqdn(options) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._delete(options.name);
        });
    }
    get_name(options) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._get(options.name);
        });
    }
    delete_name(options) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._delete(options.name);
        });
    }
    getObj(deploymentName) {
        return __awaiter(this, void 0, void 0, function* () {
            const deployments = yield this._get(deploymentName);
            const workloads = yield this._getWorkloadsByTypes(deploymentName, deployments, [
                WorkloadTypes.gatewayfqdnproxy,
                WorkloadTypes.gatewaynameproxy,
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
                    domain: workload.type === WorkloadTypes.gatewayfqdnproxy
                        ? data.fqdn
                        : workload.result.data.fqdn,
                    tls_passthrough: data.tls_passthrough,
                    backends: data.backends,
                    metadata: workload.metadata,
                    description: workload.description,
                };
            });
        });
    }
}
__decorate([
    expose,
    validateInput,
    checkBalance,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [GatewayFQDNModel]),
    __metadata("design:returntype", Promise)
], GWModule.prototype, "deploy_fqdn", null);
__decorate([
    expose,
    validateInput,
    checkBalance,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [GatewayNameModel]),
    __metadata("design:returntype", Promise)
], GWModule.prototype, "deploy_name", null);
__decorate([
    expose,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], GWModule.prototype, "list", null);
__decorate([
    expose,
    validateInput,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [GatewayFQDNGetModel]),
    __metadata("design:returntype", Promise)
], GWModule.prototype, "get_fqdn", null);
__decorate([
    expose,
    validateInput,
    checkBalance,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [GatewayFQDNDeleteModel]),
    __metadata("design:returntype", Promise)
], GWModule.prototype, "delete_fqdn", null);
__decorate([
    expose,
    validateInput,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [GatewayNameGetModel]),
    __metadata("design:returntype", Promise)
], GWModule.prototype, "get_name", null);
__decorate([
    expose,
    validateInput,
    checkBalance,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [GatewayNameDeleteModel]),
    __metadata("design:returntype", Promise)
], GWModule.prototype, "delete_name", null);
export { GWModule as gateway };
