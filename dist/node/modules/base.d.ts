import { RMB } from "../clients";
import { GridClientConfig } from "../config";
import { KubernetesHL } from "../high_level/kubernetes";
import { VMHL } from "../high_level/machine";
import { TwinDeployment } from "../high_level/models";
import { TwinDeploymentHandler } from "../high_level/twinDeploymentHandler";
import { ZdbHL } from "../high_level/zdb";
import { DeploymentFactory } from "../primitives/deployment";
import { Network } from "../primitives/network";
import { BackendStorage } from "../storage/backend";
import { Deployment } from "../zos/deployment";
import { PublicIPResult } from "../zos/public_ip";
import { Workload, WorkloadTypes } from "../zos/workload";
declare class BaseModule {
    config: GridClientConfig;
    moduleName: string;
    projectName: string;
    workloadTypes: any[];
    rmb: RMB;
    deploymentFactory: DeploymentFactory;
    twinDeploymentHandler: TwinDeploymentHandler;
    backendStorage: BackendStorage;
    constructor(config: GridClientConfig);
    getDeploymentPath(name: string): string;
    getDeploymentContracts(name: string): Promise<any>;
    save(name: string, contracts: Record<string, unknown[]>, wgConfig?: string): Promise<void>;
    _list(): Promise<string[]>;
    exists(name: string): Promise<boolean>;
    _getDeploymentNodeIds(name: string): Promise<number[]>;
    _getContractIdFromNodeId(name: string, nodeId: number): Promise<number>;
    _getNodeIdFromContractId(name: string, contractId: number): Promise<number>;
    _getWorkloadsByTypes(deploymentName: string, deployments: any, types: WorkloadTypes[]): Promise<Workload[]>;
    _getMachinePubIP(deploymentName: string, deployments: any, publicIPWorkloadName: string): Promise<PublicIPResult>;
    _getZmachineData(deploymentName: string, deployments: any, workload: Workload): Promise<Record<string, unknown>>;
    _getDiskData(deployments: any, name: any): {
        size: any;
        state: any;
        message: any;
        cache?: undefined;
        prefix?: undefined;
        minimal_shards?: undefined;
        expected_shards?: undefined;
        qsfs_zdbs_name?: undefined;
        metricsEndpoint?: undefined;
    } | {
        cache: any;
        prefix: any;
        minimal_shards: any;
        expected_shards: any;
        qsfs_zdbs_name: any;
        state: any;
        message: any;
        metricsEndpoint: any;
        size?: undefined;
    };
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
        created: any[];
        deleted: any[];
        updated: any[];
    }>;
}
export { BaseModule };
//# sourceMappingURL=base.d.ts.map