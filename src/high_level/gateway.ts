import { TwinDeployment, Operations } from "./models";
import { HighLevelBase } from "./base";
import { GWPrimitive, DeploymentFactory } from "../primitives/index";

class GatewayHL extends HighLevelBase {
    async create(
        name: string,
        node_id: number,
        tls_passthrough: boolean,
        backends: string[],
        fqdn = "",
        metadata = "",
        description = "",
    ): Promise<TwinDeployment[]> {
        const public_ips = 0;
        const gw = new GWPrimitive();
        const workloads = [];
        if (fqdn != "") {
            workloads.push(gw.createFQDN(fqdn, tls_passthrough, backends, name, metadata, description));
        } else {
            workloads.push(gw.createName(name, tls_passthrough, backends, metadata, description));
        }
        const deploymentFactory = new DeploymentFactory(
            this.config.twinId,
            this.config.substrateURL,
            this.config.mnemonic,
        );
        const deployment = deploymentFactory.create(workloads, 1626394539, metadata, description);
        const twinDeployments = [];
        twinDeployments.push(new TwinDeployment(deployment, Operations.deploy, public_ips, node_id));
        return twinDeployments;
    }
}
export { GatewayHL };
