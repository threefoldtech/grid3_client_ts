import { Mount, ZNetworkInterface, ZmachineNetwork } from "../zos/zmachine";
import { Workload } from "../zos/workload";
import { ComputeCapacity } from "../zos/computecapacity";
declare class VM {
    _createComputeCapacity(cpu: number, memory: number): ComputeCapacity;
    _createNetworkInterface(networkName: string, ip: string): ZNetworkInterface;
    _createMachineNetwork(networkName: string, ip: string, planetary: boolean, public_ip?: string): ZmachineNetwork;
    create(name: string, flist: string, cpu: number, memory: number, disks: Mount[], networkName: string, ip: string, planetary: boolean, public_ip: string, entrypoint: string, env: Record<string, unknown>, metadata?: string, description?: string, version?: number): Workload;
}
export { VM };
//# sourceMappingURL=vm.d.ts.map