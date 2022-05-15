import { GridClientConfig } from "../config";
import { TwinDeployment } from "../high_level/models";
import { Deployment } from "../zos/deployment";
import { Workload, WorkloadTypes } from "../zos/workload";
declare class HighLevelBase {
    config: GridClientConfig;
    constructor(config: GridClientConfig);
    _filterWorkloads(deployment: Deployment, names: string[], types?: WorkloadTypes[]): [Workload[], Workload[]];
    _deleteMachineNetwork(deployment: Deployment, remainingWorkloads: Workload[], deletedMachineWorkloads: Workload[], node_id: number): Promise<[TwinDeployment[], Workload[], number[], string[]]>;
    _delete(deployment: Deployment, names: string[], types?: WorkloadTypes[]): Promise<TwinDeployment[]>;
}
export { HighLevelBase };
//# sourceMappingURL=base.d.ts.map