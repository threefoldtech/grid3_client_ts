var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { WorkloadTypes } from "../zos/workload";
import { HighLevelBase } from "./base";
import { ZdbPrimitive } from "../primitives/zdb";
import { DeploymentFactory } from "../primitives/deployment";
import { TwinDeployment, Operations } from "../high_level/models";
class ZdbHL extends HighLevelBase {
    create(name, node_id, namespace, disk_size, disk_type, mode, password, publicIpv6, metadata = "", description = "") {
        const deploymentFactory = new DeploymentFactory(this.twin_id, this.url, this.mnemonic);
        const zdbFactory = new ZdbPrimitive();
        const zdbWorkload = zdbFactory.create(name, namespace, disk_size, mode, password, disk_type, publicIpv6, metadata, description);
        const deployment = deploymentFactory.create([zdbWorkload], 1626394539, metadata, description);
        return new TwinDeployment(deployment, Operations.deploy, 0, node_id);
    }
    delete(deployment, names) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._delete(deployment, names, [WorkloadTypes.zdb]);
        });
    }
}
export { ZdbHL };
