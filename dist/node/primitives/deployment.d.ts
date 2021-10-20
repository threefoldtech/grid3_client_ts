import { Deployment } from "../zos/deployment";
import { Workload } from "../zos/workload";
import { Network } from "./network";
declare class DeploymentFactory {
    twin_id: number;
    url: string;
    mnemonic: string;
    constructor(twin_id: number, url: string, mnemonic: string);
    create(workloads: Workload[], expiration: number, metadata?: string, description?: string, version?: number): Deployment;
    UpdateDeployment(oldDeployment: Deployment, newDeployment: Deployment, network?: Network): Promise<Deployment>;
    fromObj(deployment: any): Deployment;
}
export { DeploymentFactory };
//# sourceMappingURL=deployment.d.ts.map