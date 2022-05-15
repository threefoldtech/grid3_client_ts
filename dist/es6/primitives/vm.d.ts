import { ComputeCapacity } from "../zos/computecapacity";
import { Workload } from "../zos/workload";
import { Mount, ZmachineNetwork, ZNetworkInterface } from "../zos/zmachine";
declare class VMPrimitive {
    _createComputeCapacity(cpu: number, memory: number): ComputeCapacity;
    _createNetworkInterface(networkName: string, ip: string): ZNetworkInterface;
    _createMachineNetwork(networkName: string, ip: string, planetary: boolean, public_ip?: string): ZmachineNetwork;
    create(name: string, flist: string, cpu: number, memory: number, rootfs_size: number, disks: Mount[], networkName: string, ip: string, planetary: boolean, public_ip: string, entrypoint: string, env: Record<string, unknown>, metadata?: string, description?: string, version?: number, corex?: boolean): Workload;
}
export { VMPrimitive };
//# sourceMappingURL=vm.d.ts.map