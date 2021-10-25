import { WorkloadTypes } from "../zos/workload";
import { BaseModule } from "./base";
import { MachinesModel, MachinesDeleteModel, MachinesGetModel, AddMachineModel, DeleteMachineModel } from "./models";
import { Network } from "../primitives/network";
import { VMHL } from "../high_level/machine";
import { MessageBusClientInterface } from "ts-rmb-client-base";
import { TwinDeployment } from "../high_level/models";
declare class MachineModule extends BaseModule {
    twin_id: number;
    url: string;
    mnemonic: string;
    rmbClient: MessageBusClientInterface;
    storePath: string;
    fileName: string;
    workloadTypes: WorkloadTypes[];
    vm: VMHL;
    constructor(twin_id: number, url: string, mnemonic: string, rmbClient: MessageBusClientInterface, storePath: string, projectName?: string);
    _createDeloyment(options: MachinesModel): Promise<[TwinDeployment[], Network, string]>;
<<<<<<< HEAD
    _getMachineWorkload(deployments: any): Workload;
=======
>>>>>>> update scripts
    deploy(options: MachinesModel): Promise<{
        contracts: {
            created: any[];
            updated: any[];
            deleted: any[];
        };
        wireguard_config: string;
    }>;
    list(): string[];
<<<<<<< HEAD
=======
    getObj(deploymentName: string): Promise<Record<string, unknown>[]>;
>>>>>>> update scripts
    get(options: MachinesGetModel): Promise<any[]>;
    delete(options: MachinesDeleteModel): Promise<{
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
    addMachine(options: AddMachineModel): Promise<{
        contracts: {
            created: any[];
            updated: any[];
            deleted: any[];
        };
    }>;
    deleteMachine(options: DeleteMachineModel): Promise<{
        created: any[];
        updated: any[];
        deleted: any[];
    }>;
}
export { MachineModule };
//# sourceMappingURL=machine.d.ts.map