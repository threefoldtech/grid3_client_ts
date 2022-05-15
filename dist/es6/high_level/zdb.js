var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { events } from "../helpers/events";
import { Operations, TwinDeployment } from "../high_level/models";
import { DeploymentFactory } from "../primitives/deployment";
import { Nodes } from "../primitives/nodes";
import { ZdbPrimitive } from "../primitives/zdb";
import { WorkloadTypes } from "../zos/workload";
import { HighLevelBase } from "./base";
class ZdbHL extends HighLevelBase {
    create(name, node_id, disk_size, mode, password, publicNamespace, metadata = "", description = "") {
        return __awaiter(this, void 0, void 0, function* () {
            const nodes = new Nodes(this.config.graphqlURL, this.config.rmbClient["proxyURL"]);
            if (!(yield nodes.nodeHasResources(node_id, { hru: disk_size }))) {
                throw Error(`Node ${node_id} doesn't have enough resources: hru=${disk_size}`);
            }
            events.emit("logs", `Creating a zdb on node: ${node_id}`);
            const deploymentFactory = new DeploymentFactory(this.config);
            const zdbFactory = new ZdbPrimitive();
            const zdbWorkload = zdbFactory.create(name, disk_size, mode, password, publicNamespace, metadata, description);
            const deployment = deploymentFactory.create([zdbWorkload], 1626394539, metadata, description);
            return new TwinDeployment(deployment, Operations.deploy, 0, node_id);
        });
    }
    delete(deployment, names) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._delete(deployment, names, [WorkloadTypes.zdb]);
        });
    }
}
export { ZdbHL };
