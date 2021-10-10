import { BaseModule } from "./base";
import { Machines, MachinesDelete, MachinesGet } from "./models";
import { VirtualMachine } from "../high_level/machine";
import { MessageBusClientInterface } from "ts-rmb-client-base";
declare class Machine extends BaseModule {
    twin_id: number;
    url: string;
    mnemonic: string;
    rmbClient: MessageBusClientInterface;
    fileName: string;
    vm: VirtualMachine;
    constructor(twin_id: number, url: string, mnemonic: string, rmbClient: MessageBusClientInterface);
    deploy(options: Machines): Promise<{
        contracts: {
            created: any[];
            updated: any[];
            deleted: any[];
        };
        wireguard_config: string;
    }>;
    list(): string[];
    get(options: MachinesGet): Promise<any[]>;
    delete(options: MachinesDelete): Promise<{
        deleted: any[];
        updated: any[];
    }>;
    update(options: Machines): Promise<{
        contracts: {
            created: any[];
            updated: any[];
            deleted: any[];
        };
    }>;
}
export { Machine };
//# sourceMappingURL=machine.d.ts.map