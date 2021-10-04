import { Deployment } from "../zos/deployment";
import { TFClient } from "../tf-grid/client";
import { TwinDeployment } from "./models";
declare class TwinDeploymentHandler {
    rmbClient: any;
    twin_id: number;
    url: string;
    mnemonic: string;
    tfclient: TFClient;
    constructor(rmbClient: any, twin_id: number, url: string, mnemonic: string);
    deploy(deployment: Deployment, node_id: number, publicIps: number): Promise<any>;
    update(deployment: Deployment, publicIps: number): Promise<any>;
    delete(contract_id: number): Promise<number>;
    getDeployment(contract_id: any): Promise<any>;
    checkWorkload(workload: any, targetWorkload: any): boolean;
    waitForDeployment(twinDeployment: TwinDeployment, timeout?: number): Promise<boolean>;
    waitForDeployments(twinDeployments: TwinDeployment[], timeout?: number): Promise<boolean>;
    deployMerge(twinDeployments: TwinDeployment[]): TwinDeployment[];
    _updateToLatest(twinDeployments: TwinDeployment[]): TwinDeployment;
    updateMerge(twinDeployments: TwinDeployment[]): TwinDeployment[];
    merge(twinDeployments: TwinDeployment[]): TwinDeployment[];
    handle(twinDeployments: TwinDeployment[]): Promise<{
        created: any[];
        updated: any[];
        deleted: any[];
    }>;
}
export { TwinDeploymentHandler };
