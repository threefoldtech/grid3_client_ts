import { Deployment } from "../zos/deployment";
import { WorkloadTypes, Workload } from "../zos/workload";
import { TwinDeployment } from "../high_level/models";
declare class HighLevelBase {
    twin_id: number;
    url: string;
    mnemonic: string;
    rmbClient: any;
    constructor(twin_id: number, url: string, mnemonic: string, rmbClient: any);
    _filterWorkloads(deployment: Deployment, names: string[], types?: WorkloadTypes[]): [Workload[], Workload[]];
    _deleteMachineNetwork(deployment: Deployment, remainingWorkloads: Workload[], deletedMachineWorkloads: Workload[], node_id: number): Promise<[TwinDeployment[], Workload[], number[], string[]]>;
    _delete(deployment: Deployment, names: string[], types?: WorkloadTypes[]): Promise<TwinDeployment[]>;
}
export { HighLevelBase };
