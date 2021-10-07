import { Deployment } from "../zos/deployment";
import { TwinDeployment } from "./models";
import { HighLevelBase } from "./base";
import { Network } from "../primitives/index";
declare class VirtualMachineDisk {
    name: string;
    size: number;
    mountpoint: string;
}
declare class VirtualMachine extends HighLevelBase {
    create(name: string, nodeId: number, flist: string, cpu: number, memory: number, disks: VirtualMachineDisk[], publicIp: boolean, network: Network, entrypoint: string, env: Record<string, unknown>, metadata?: string, description?: string): Promise<[TwinDeployment[], string]>;
    update(oldDeployment: Deployment, name: string, nodeId: number, flist: string, cpu: number, memory: number, disks: VirtualMachineDisk[], publicIp: boolean, network: Network, entrypoint: string, env: Record<string, unknown>, metadata?: string, description?: string): Promise<TwinDeployment>;
    delete(deployment: Deployment, names: string[]): Promise<TwinDeployment[]>;
}
export { VirtualMachine, VirtualMachineDisk };
//# sourceMappingURL=machine.d.ts.map