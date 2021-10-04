import { ComputeCapacity } from "./computecapacity";
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
declare class Zmachine {
    flist: string;
    network: ZmachineNetwork;
    size: number;
    compute_capacity: ComputeCapacity;
    mounts: Mount[];
    entrypoint: string;
    env: Record<string, unknown>;
    challenge(): string;
}
declare class ZmachineResult {
    id: string;
    ip: string;
}
export { Zmachine, ZmachineNetwork, ZNetworkInterface, Mount, ZmachineResult };
