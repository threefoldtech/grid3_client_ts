import { Deployment } from "../zos/deployment";
import { Network } from "../primitives/network";
declare enum Operations {
    deploy = "deploy",
    update = "update",
    delete = "delete"
}
declare class TwinDeployment {
    deployment: Deployment;
    operation: Operations;
    publicIps: number;
    nodeId: number;
    network: Network;
    constructor(deployment: Deployment, operation: Operations, publicIps: number, nodeId: number, network?: Network);
}
export { TwinDeployment, Operations };
//# sourceMappingURL=models.d.ts.map