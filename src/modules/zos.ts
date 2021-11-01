import { WorkloadTypes } from "../zos/workload";

import { getRMBClient } from "../clients/rmb";

import { ZOSModel } from "./models";
import { expose } from "../helpers/expose";
import { default as config } from "../../config.json";
import { TwinDeploymentHandler } from "../high_level/twinDeploymentHandler";
import { DeploymentFactory } from "../primitives/deployment";

class Zos {
    @expose
    async deploy(options: ZOSModel) {
        // get node_id from the deployment
        const node_id = options.node_id;
        delete options.node_id;

        const deploymentFactory = new DeploymentFactory(config.twin_id, config.url, config.mnemonic);
        const deployment = await deploymentFactory.fromObj(options);
        deployment.sign(deployment.twin_id, config.mnemonic);

        let publicIps = 0;
        for (const workload of deployment.workloads) {
            if (workload.type === WorkloadTypes.ipv4) {
                publicIps++;
            }
        }
        console.log(`Deploying on node_id: ${node_id} with number of public IPs: ${publicIps}`);
        const rmbClient = getRMBClient();
        const twinDeploymentHandler = new TwinDeploymentHandler(rmbClient, config.twin_id, config.url, config.mnemonic);
        return await twinDeploymentHandler.deploy(deployment, node_id, publicIps);
    }
}

export { Zos as zos };
