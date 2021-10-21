import { Workload, WorkloadTypes } from "../zos/workload";
import { AddWorkerModel, DeleteWorkerModel, K8SModel, K8SDeleteModel, K8SGetModel } from "./models";
import { BaseModule } from "./base";
import { TwinDeployment } from "../high_level/models";
import { KubernetesHL } from "../high_level/kubernetes";
import { Network } from "../primitives/network";
import { MessageBusClientInterface } from "ts-rmb-client-base";
declare class K8sModule extends BaseModule {
    twin_id: number;
    url: string;
    mnemonic: string;
    rmbClient: MessageBusClientInterface;
    storePath: string;
    fileName: string;
    workloadTypes: WorkloadTypes[];
    kubernetes: KubernetesHL;
    constructor(twin_id: number, url: string, mnemonic: string, rmbClient: MessageBusClientInterface, storePath: string);
    _getMastersWorkload(deployments: any): Workload[];
    _getMastersIp(deployments: any): string[];
    _createDeployment(options: K8SModel, masterIps?: string[]): Promise<[TwinDeployment[], Network, string]>;
    deploy(options: K8SModel): Promise<{
        contracts: {
            created: any[];
            updated: any[];
            deleted: any[];
        };
        wireguard_config: string;
    }>;
    list(): string[];
    get(options: K8SGetModel): Promise<any[]>;
    delete(options: K8SDeleteModel): Promise<{
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
    addWorker(options: AddWorkerModel): Promise<{
        contracts: {
            created: any[];
            updated: any[];
            deleted: any[];
        };
    }>;
    deleteWorker(options: DeleteWorkerModel): Promise<{
        created: any[];
        updated: any[];
        deleted: any[];
    }>;
}
export { K8sModule };
//# sourceMappingURL=k8s.d.ts.map