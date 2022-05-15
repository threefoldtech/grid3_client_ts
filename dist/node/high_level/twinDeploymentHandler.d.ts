import { RMB } from "../clients";
import { TFClient } from "../clients/tf-grid/client";
import { GridClientConfig } from "../config";
import { Deployment } from "../zos/deployment";
import { Workload } from "../zos/workload";
import { TwinDeployment } from "./models";
declare class TwinDeploymentHandler {
    config: GridClientConfig;
    tfclient: TFClient;
    rmb: RMB;
    constructor(config: GridClientConfig);
    createNameContract(name: string): Promise<any>;
    deleteNameContract(name: string): Promise<void>;
    deploy(deployment: Deployment, node_id: number, publicIps: number): Promise<any>;
    update(deployment: Deployment): Promise<any>;
    delete(contract_id: number): Promise<number>;
    getDeployment(contract_id: number, node_twin_id: number): Promise<any>;
    checkWorkload(workload: Workload, targetWorkload: Workload, nodeId: number): boolean;
    waitForDeployment(twinDeployment: TwinDeployment, timeout?: number): Promise<void>;
    waitForDeployments(twinDeployments: TwinDeployment[], timeout?: number): Promise<void[]>;
    saveNetworks(twinDeployments: TwinDeployment[]): Promise<void>;
    deployMerge(twinDeployments: TwinDeployment[]): TwinDeployment[];
    _updateToLatest(twinDeployments: TwinDeployment[]): TwinDeployment;
    updateMerge(twinDeployments: TwinDeployment[]): TwinDeployment[];
    merge(twinDeployments: TwinDeployment[]): TwinDeployment[];
    validate(twinDeployments: TwinDeployment[]): Promise<void>;
    rollback(twinDeployments: TwinDeployment[], contracts: any): Promise<void>;
    handle(twinDeployments: TwinDeployment[]): Promise<{
        created: any[];
        updated: any[];
        deleted: any[];
    }>;
}
export { TwinDeploymentHandler };
//# sourceMappingURL=twinDeploymentHandler.d.ts.map