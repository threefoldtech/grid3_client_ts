"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GWModule = void 0;
const base_1 = require("./base");
const gateway_1 = require("../high_level/gateway");
const workload_1 = require("../zos/workload");
class GWModule extends base_1.BaseModule {
    twin_id;
    url;
    mnemonic;
    rmbClient;
    storePath;
    fileName = "gateway.json";
    workloadTypes = [workload_1.WorkloadTypes.gatewayfqdnproxy, workload_1.WorkloadTypes.gatewaynameproxy];
    gateway;
    constructor(twin_id, url, mnemonic, rmbClient, storePath) {
        super(twin_id, url, mnemonic, rmbClient, storePath);
        this.twin_id = twin_id;
        this.url = url;
        this.mnemonic = mnemonic;
        this.rmbClient = rmbClient;
        this.storePath = storePath;
        this.gateway = new gateway_1.GatewayHL(twin_id, url, mnemonic, rmbClient, this.storePath);
    }
    async deploy_fqdn(options) {
        if (this.exists(options.name)) {
            throw Error(`Another gateway deployment with the same name ${options.name} is already exist`);
        }
        const twinDeployments = await this.gateway.create(options.name, options.node_id, options.tls_passthrough, options.backends, options.fqdn);
        const contracts = await this.twinDeploymentHandler.handle(twinDeployments);
        this.save(options.name, contracts);
        return { contracts: contracts };
    }
    async deploy_name(options) {
        if (this.exists(options.name)) {
            throw Error(`Another gateway deployment with the same name ${options.name} is already exist`);
        }
        const twinDeployments = await this.gateway.create(options.name, options.node_id, options.tls_passthrough, options.backends);
        const contracts = await this.twinDeploymentHandler.handle(twinDeployments);
        this.save(options.name, contracts);
        return { contracts: contracts };
    }
    async getPrettyObj(deploymentName) {
        const deployments = await this._get(deploymentName);
        const workloads = this._getWorkloadsByType(deployments, workload_1.WorkloadTypes.gatewayfqdnproxy);
        workloads.forEach(workload => {
            const data = workload.data;
            return {
                version: workload.version,
                name: workload.name,
                created: workload.result.created,
                status: workload.result.state,
                message: workload.result.message,
                fqdn: data.fqdn,
                tls_passthrough: data.tls_passthrough,
                backends: data.backends,
                metadata: workload.metadata,
                description: workload.description,
                ...workload.result.data,
            };
        });
    }
}
exports.GWModule = GWModule;
