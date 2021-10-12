"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZdbHL = void 0;
const workload_1 = require("../zos/workload");
const base_1 = require("./base");
const zdb_1 = require("../primitives/zdb");
const deployment_1 = require("../primitives/deployment");
const models_1 = require("../high_level/models");
class ZdbHL extends base_1.HighLevelBase {
    create(name, node_id, namespace, disk_size, disk_type, mode, password, publicIpv6, metadata = "", description = "") {
        const deploymentFactory = new deployment_1.DeploymentFactory(this.twin_id, this.url, this.mnemonic);
        const zdbFactory = new zdb_1.ZdbPrimitive();
        const zdbWorkload = zdbFactory.create(name, namespace, disk_size, mode, password, disk_type, publicIpv6, metadata, description);
        const deployment = deploymentFactory.create([zdbWorkload], 1626394539, metadata, description);
        return new models_1.TwinDeployment(deployment, models_1.Operations.deploy, 0, node_id);
    }
    async delete(deployment, names) {
        return await this._delete(deployment, names, [workload_1.WorkloadTypes.zdb]);
    }
}
exports.ZdbHL = ZdbHL;
