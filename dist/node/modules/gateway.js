"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GWModule = void 0;
const base_1 = require("./base");
const gateway_1 = require("../high_level/gateway");
class GWModule extends base_1.BaseModule {
    twin_id;
    url;
    mnemonic;
    rmbClient;
    fileName = "gateway.json";
    gateway;
    constructor(twin_id, url, mnemonic, rmbClient) {
        super(twin_id, url, mnemonic, rmbClient);
        this.twin_id = twin_id;
        this.url = url;
        this.mnemonic = mnemonic;
        this.rmbClient = rmbClient;
        this.gateway = new gateway_1.GatewayHL(twin_id, url, mnemonic, rmbClient);
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
}
exports.GWModule = GWModule;
