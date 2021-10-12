"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GatewayHL = void 0;
const models_1 = require("./models");
const base_1 = require("./base");
const index_1 = require("../primitives/index");
class GatewayHL extends base_1.HighLevelBase {
    async create(name, node_id, tls_passthrough, backends, fqdn = "", metadata = "", description = "") {
        const public_ips = 0;
        const gw = new index_1.GWPrimitive();
        const workloads = [];
        if (fqdn != "") {
            workloads.push(gw.createFQDN(fqdn, tls_passthrough, backends, name, metadata, description));
        }
        else {
            workloads.push(gw.createName(name, tls_passthrough, backends, metadata, description));
        }
        const deploymentFactory = new index_1.DeploymentFactory(this.twin_id, this.url, this.mnemonic);
        const deployment = deploymentFactory.create(workloads, 1626394539, metadata, description);
        const twinDeployments = [];
        twinDeployments.push(new models_1.TwinDeployment(deployment, models_1.Operations.deploy, public_ips, node_id));
        return twinDeployments;
    }
}
exports.GatewayHL = GatewayHL;
