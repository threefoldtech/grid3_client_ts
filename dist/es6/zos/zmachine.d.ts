import { ComputeCapacity } from "./computecapacity";
import { WorkloadData, WorkloadDataResult } from "./workload_base";
declare class ZNetworkInterface {
    network: string;
    ip: string;
}
declare class ZmachineNetwork {
    public_ip: string;
    interfaces: ZNetworkInterface[];
    planetary: boolean;
    challenge(): string;
}
declare class Mount {
    name: string;
    mountpoint: string;
    challenge(): string;
}
declare class Zmachine extends WorkloadData {
    flist: string;
    network: ZmachineNetwork;
    size: number;
    compute_capacity: ComputeCapacity;
    mounts: Mount[];
    entrypoint: string;
    env: Record<string, unknown>;
    corex: boolean;
    challenge(): string;
}
declare class ZmachineResult extends WorkloadDataResult {
    id: string;
    ip: string;
    ygg_ip: string;
}
export { Zmachine, ZmachineNetwork, ZNetworkInterface, Mount, ZmachineResult };
//# sourceMappingURL=zmachine.d.ts.map