"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZdbHL = void 0;
const events_1 = require("../helpers/events");
const models_1 = require("../high_level/models");
const deployment_1 = require("../primitives/deployment");
const nodes_1 = require("../primitives/nodes");
const zdb_1 = require("../primitives/zdb");
const workload_1 = require("../zos/workload");
const base_1 = require("./base");
class ZdbHL extends base_1.HighLevelBase {
    async create(name, node_id, disk_size, mode, password, publicNamespace, metadata = "", description = "") {
        const nodes = new nodes_1.Nodes(this.config.graphqlURL, this.config.rmbClient["proxyURL"]);
        if (!(await nodes.nodeHasResources(node_id, { hru: disk_size }))) {
            throw Error(`Node ${node_id} doesn't have enough resources: hru=${disk_size}`);
        }
        events_1.events.emit("logs", `Creating a zdb on node: ${node_id}`);
        const deploymentFactory = new deployment_1.DeploymentFactory(this.config);
        const zdbFactory = new zdb_1.ZdbPrimitive();
        const zdbWorkload = zdbFactory.create(name, disk_size, mode, password, publicNamespace, metadata, description);
        const deployment = deploymentFactory.create([zdbWorkload], 1626394539, metadata, description);
        return new models_1.TwinDeployment(deployment, models_1.Operations.deploy, 0, node_id);
    }
    async delete(deployment, names) {
        return await this._delete(deployment, names, [workload_1.WorkloadTypes.zdb]);
    }
}
exports.ZdbHL = ZdbHL;
