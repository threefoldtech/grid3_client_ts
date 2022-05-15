import { GridClientConfig } from "../config";
import { VMHL } from "../high_level/machine";
import { TwinDeployment } from "../high_level/models";
import { Network } from "../primitives/network";
import { WorkloadTypes } from "../zos/workload";
import { BaseModule } from "./base";
import { AddMachineModel, DeleteMachineModel, MachinesDeleteModel, MachinesGetModel, MachinesModel } from "./models";
declare class MachinesModule extends BaseModule {
    config: GridClientConfig;
    moduleName: string;
    workloadTypes: WorkloadTypes[];
    vm: VMHL;
    constructor(config: GridClientConfig);
    _createDeployment(options: MachinesModel): Promise<[TwinDeployment[], Network, string]>;
    deploy(options: MachinesModel): Promise<{
        contracts: {
            created: any[];
            updated: any[];
            deleted: any[];
        };
        wireguard_config: string;
    }>;
    list(): Promise<string[]>;
    getObj(deploymentName: string): Promise<Record<string, unknown>[]>;
    get(options: MachinesGetModel): Promise<any[]>;
    delete(options: MachinesDeleteModel): Promise<{
        created: any[];
        deleted: any[];
        updated: any[];
    }>;
    update(options: MachinesModel): Promise<"Nothing found to update" | {
        contracts: {
            created: any[];
            updated: any[];
            deleted: any[];
        };
    }>;
    add_machine(options: AddMachineModel): Promise<{
        contracts: {
            created: any[];
            updated: any[];
            deleted: any[];
        };
    }>;
    delete_machine(options: DeleteMachineModel): Promise<{
        created: any[];
        updated: any[];
        deleted: any[];
    }>;
}
export { MachinesModule as machines };
//# sourceMappingURL=machines.d.ts.map