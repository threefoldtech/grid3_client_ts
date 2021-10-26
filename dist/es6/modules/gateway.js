var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { BaseModule } from "./base";
import { GatewayHL } from "../high_level/gateway";
import { WorkloadTypes } from "../zos/workload";
class GWModule extends BaseModule {
    constructor(twin_id, url, mnemonic, rmbClient, storePath, projectName = "") {
        super(twin_id, url, mnemonic, rmbClient, storePath, projectName);
        this.twin_id = twin_id;
        this.url = url;
        this.mnemonic = mnemonic;
        this.rmbClient = rmbClient;
        this.storePath = storePath;
        this.fileName = "gateway.json";
        this.workloadTypes = [WorkloadTypes.gatewayfqdnproxy, WorkloadTypes.gatewaynameproxy];
        this.gateway = new GatewayHL(twin_id, url, mnemonic, rmbClient, this.storePath);
    }
    deploy_fqdn(options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.exists(options.name)) {
                throw Error(`Another gateway deployment with the same name ${options.name} is already exist`);
            }
            const twinDeployments = yield this.gateway.create(options.name, options.node_id, options.tls_passthrough, options.backends, options.fqdn);
            const contracts = yield this.twinDeploymentHandler.handle(twinDeployments);
            this.save(options.name, contracts);
            return { contracts: contracts };
        });
    }
    deploy_name(options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.exists(options.name)) {
                throw Error(`Another gateway deployment with the same name ${options.name} is already exist`);
            }
            const twinDeployments = yield this.gateway.create(options.name, options.node_id, options.tls_passthrough, options.backends);
            const contracts = yield this.twinDeploymentHandler.handle(twinDeployments);
            this.save(options.name, contracts);
            return { contracts: contracts };
        });
    }
    getObj(deploymentName) {
        return __awaiter(this, void 0, void 0, function* () {
            const deployments = yield this._get(deploymentName);
            const workloads = this._getWorkloadsByType(deployments, WorkloadTypes.gatewayfqdnproxy);
            workloads.forEach(workload => {
                const data = workload.data;
                return Object.assign({ version: workload.version, name: workload.name, created: workload.result.created, status: workload.result.state, message: workload.result.message, fqdn: data.fqdn, tls_passthrough: data.tls_passthrough, backends: data.backends, metadata: workload.metadata, description: workload.description }, workload.result.data);
            });
        });
    }
}
export { GWModule };
