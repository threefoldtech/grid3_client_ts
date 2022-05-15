import { GridClientConfig } from "../config";
import { KubernetesHL } from "../high_level/kubernetes";
import { TwinDeployment } from "../high_level/models";
import { Network } from "../primitives/network";
import { Workload, WorkloadTypes } from "../zos/workload";
import { BaseModule } from "./base";
import { AddWorkerModel, DeleteWorkerModel, K8SDeleteModel, K8SGetModel, K8SModel } from "./models";
declare class K8sModule extends BaseModule {
    config: GridClientConfig;
    moduleName: string;
    workloadTypes: WorkloadTypes[];
    kubernetes: KubernetesHL;
    constructor(config: GridClientConfig);
    _getMastersWorkload(deploymentName: string, deployments: any): Promise<Workload[]>;
    _getWorkersWorkload(deploymentName: string, deployments: any): Promise<Workload[]>;
    _getMastersIp(deploymentName: string, deployments: any): Promise<string[]>;
    _createDeployment(options: K8SModel, masterIps?: string[]): Promise<[TwinDeployment[], Network, string]>;
    deploy(options: K8SModel): Promise<{
        contracts: {
            created: any[];
            updated: any[];
            deleted: any[];
        };
        wireguard_config: string;
    }>;
    list(): Promise<string[]>;
    getObj(deploymentName: string): Promise<{
        masters: any[];
        workers: any[];
    }>;
    get(options: K8SGetModel): Promise<any[]>;
    delete(options: K8SDeleteModel): Promise<{
        created: any[];
        deleted: any[];
        updated: any[];
    }>;
    update(options: K8SModel): Promise<"Nothing found to update" | {
        contracts: {
            created: any[];
            updated: any[];
            deleted: any[];
        };
    }>;
    add_worker(options: AddWorkerModel): Promise<{
        contracts: {
            created: any[];
            updated: any[];
            deleted: any[];
        };
    }>;
    delete_worker(options: DeleteWorkerModel): Promise<{
        created: any[];
        updated: any[];
        deleted: any[];
    }>;
}
export { K8sModule as k8s };
//# sourceMappingURL=k8s.d.ts.map