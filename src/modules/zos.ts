import { MessageBusClientInterface } from "ts-rmb-client-base";

import { WorkloadTypes } from "../zos/workload";
import { ZOSModel } from "./models";
import { expose } from "../helpers/expose";
import { Operations, TwinDeployment } from "../high_level/models";
import { TwinDeploymentHandler } from "../high_level/twinDeploymentHandler";
import { DeploymentFactory } from "../primitives/deployment";
import { BackendStorageType } from "../storage/backend";

class Zos {
    constructor(
        public twin_id: number,
        public url: string,
        public mnemonic: string,
        public rmbClient: MessageBusClientInterface,
        public storePath: string,
        public projectName = "",
        public backendStorageType: BackendStorageType = BackendStorageType.default,
    ) {}

    @expose
    async deploy(options: ZOSModel) {
        // get node_id from the deployment
        const node_id = options.node_id;
        delete options.node_id;

        const deploymentFactory = new DeploymentFactory(this.twin_id, this.url, this.mnemonic);
        const deployment = await deploymentFactory.fromObj(options);

        let publicIps = 0;
        for (const workload of deployment.workloads) {
            if (workload.type === WorkloadTypes.ipv4) {
                publicIps++;
            }
        }
        console.log(`Deploying on node_id: ${node_id} with number of public IPs: ${publicIps}`);
        const twinDeployment = new TwinDeployment(deployment, Operations.deploy, publicIps, node_id);
        const twinDeploymentHandler = new TwinDeploymentHandler(this.rmbClient, this.twin_id, this.url, this.mnemonic);
        return await twinDeploymentHandler.handle([twinDeployment]);
    }
}

export { Zos as zos };
