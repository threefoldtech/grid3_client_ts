import { GridClientConfig } from "../config";
import { Deployment } from "../zos/deployment";
import { Workload } from "../zos/workload";
import { Network } from "./network";
declare class DeploymentFactory {
    config: GridClientConfig;
    constructor(config: GridClientConfig);
    create(workloads: Workload[], expiration: number, metadata?: string, description?: string, version?: number): Deployment;
    UpdateDeployment(oldDeployment: Deployment, newDeployment: Deployment, network?: Network): Promise<Deployment>;
    fromObj(deployment: any): Promise<Deployment>;
}
export { DeploymentFactory };
//# sourceMappingURL=deployment.d.ts.map