import { GridClientConfig } from "../config";
import { expose } from "../helpers/expose";
import { validateInput } from "../helpers/validator";
import { Operations, TwinDeployment } from "../high_level/models";
import { TwinDeploymentHandler } from "../high_level/twinDeploymentHandler";
import { DeploymentFactory } from "../primitives/deployment";
import { WorkloadTypes } from "../zos/workload";
import { ZOSModel } from "./models";
import { checkBalance } from "./utils";

class Zos {
    constructor(public config: GridClientConfig) {}

    @expose
    @validateInput
    @checkBalance
    async deploy(options: ZOSModel) {
        // get node_id from the deployment
        const node_id = options.node_id;
        delete options.node_id;

        const deploymentFactory = new DeploymentFactory(this.config);
        const deployment = await deploymentFactory.fromObj(options);

        let publicIps = 0;
        for (const workload of deployment.workloads) {
            if (workload.type === WorkloadTypes.ipv4) {
                publicIps++;
            }
        }
        console.log(`Deploying on node_id: ${node_id} with number of public IPs: ${publicIps}`);
        const twinDeployment = new TwinDeployment(deployment, Operations.deploy, publicIps, node_id);
        const twinDeploymentHandler = new TwinDeploymentHandler(this.config);
        return await twinDeploymentHandler.handle([twinDeployment]);
    }
}

export { Zos as zos };
