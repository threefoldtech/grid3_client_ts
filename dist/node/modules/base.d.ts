import { Deployment } from "../zos/deployment";
import { TwinDeploymentHandler } from "../high_level/twinDeploymentHandler";
import { TwinDeployment } from "../high_level/models";
import { KubernetesHL } from "../high_level/kubernetes";
import { ZdbHL } from "../high_level/zdb";
import { DeploymentFactory } from "../primitives/deployment";
import { Network } from "../primitives/network";
import { MessageBusClientInterface } from "ts-rmb-client-base";
import { VMHL } from "../high_level/machine";
declare class BaseModule {
    twin_id: number;
    url: string;
    mnemonic: string;
    rmbClient: MessageBusClientInterface;
    storePath: string;
    projectName: string;
    fileName: string;
    workloadTypes: any[];
    deploymentFactory: DeploymentFactory;
    twinDeploymentHandler: TwinDeploymentHandler;
    constructor(twin_id: number, url: string, mnemonic: string, rmbClient: MessageBusClientInterface, storePath: string);
    _load(): any[];
    save(name: string, contracts: Record<string, unknown[]>, wgConfig?: string): {
        contracts: any[];
        wireguard_config: string;
    };
    _list(): string[];
    exists(name: string): boolean;
    _getDeploymentNodeIds(name: string): number[];
    _getContracts(name: string): string[];
    _getContractIdFromNodeId(name: string, nodeId: number): number;
    _getNodeIdFromContractId(name: string, contractId: number): number;
    _get(name: string): Promise<any[]>;
    _update(module: KubernetesHL | ZdbHL | VMHL, name: string, oldDeployments: Deployment[], twinDeployments: TwinDeployment[], network?: Network): Promise<"Nothing found to update" | {
        contracts: {
            created: any[];
            updated: any[];
            deleted: any[];
        };
    }>;
    _add(deployment_name: string, node_id: number, oldDeployments: Deployment[], twinDeployments: TwinDeployment[], network?: Network): Promise<{
        contracts: {
            created: any[];
            updated: any[];
            deleted: any[];
        };
    }>;
    _deleteInstance(module: KubernetesHL | ZdbHL | VMHL, deployment_name: string, name: string): Promise<{
        created: any[];
        updated: any[];
        deleted: any[];
    }>;
    _delete(name: string): Promise<{
        deleted: any[];
        updated: any[];
    }>;
}
export { BaseModule };
//# sourceMappingURL=base.d.ts.map