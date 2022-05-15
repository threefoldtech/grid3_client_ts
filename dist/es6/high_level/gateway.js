var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { DeploymentFactory, GWPrimitive } from "../primitives/index";
import { HighLevelBase } from "./base";
import { Operations, TwinDeployment } from "./models";
class GatewayHL extends HighLevelBase {
    create(name, node_id, tls_passthrough, backends, fqdn = "", metadata = "", description = "") {
        return __awaiter(this, void 0, void 0, function* () {
            const public_ips = 0;
            const gw = new GWPrimitive();
            const workloads = [];
            if (fqdn != "") {
                workloads.push(gw.createFQDN(fqdn, tls_passthrough, backends, name, metadata, description));
            }
            else {
                workloads.push(gw.createName(name, tls_passthrough, backends, metadata, description));
            }
            const deploymentFactory = new DeploymentFactory(this.config);
            const deployment = deploymentFactory.create(workloads, 1626394539, metadata, description);
            const twinDeployments = [];
            twinDeployments.push(new TwinDeployment(deployment, Operations.deploy, public_ips, node_id));
            return twinDeployments;
        });
    }
}
export { GatewayHL };
