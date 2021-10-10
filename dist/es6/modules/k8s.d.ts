import { Workload } from "../zos/workload";
import { AddWorker, DeleteWorker, K8S, K8SDelete, K8SGet } from "./models";
import { BaseModule } from "./base";
import { TwinDeployment } from "../high_level/models";
import { Kubernetes } from "../high_level/kubernetes";
import { Network } from "../primitives/network";
import { MessageBusClientInterface } from "ts-rmb-client-base";
declare class K8s extends BaseModule {
    twin_id: number;
    url: string;
    mnemonic: string;
    rmbClient: MessageBusClientInterface;
    fileName: string;
    kubernetes: Kubernetes;
    constructor(twin_id: number, url: string, mnemonic: string, rmbClient: MessageBusClientInterface);
    _getMastersWorkload(deployments: any): Workload[];
    _getMastersIp(deployments: any): string[];
    _createDeployment(options: K8S, network: Network, masterIps?: string[]): Promise<[TwinDeployment[], string]>;
    deploy(options: K8S): Promise<{
        contracts: {
            created: any[];
            updated: any[];
            deleted: any[];
        };
        wireguard_config: string;
    }>;
    list(): string[];
    get(options: K8SGet): Promise<any[]>;
    delete(options: K8SDelete): Promise<{
        deleted: any[];
        updated: any[];
    }>;
    update(options: K8S): Promise<"Nothing found to update" | {
        contracts: {
            created: any[];
            updated: any[];
            deleted: any[];
        };
    }>;
    add_worker(options: AddWorker): Promise<{
        contracts: {
            created: any[];
            updated: any[];
            deleted: any[];
        };
    }>;
    delete_worker(options: DeleteWorker): Promise<{
        created: any[];
        updated: any[];
        deleted: any[];
    }>;
}
export { K8s };
//# sourceMappingURL=k8s.d.ts.map