import { ComputeCapacity } from "../zos/computecapacity";
import { Workload, WorkloadTypes } from "../zos/workload";
import { Mount, Zmachine, ZmachineNetwork, ZNetworkInterface } from "../zos/zmachine";

class VMPrimitive {
    _createComputeCapacity(cpu: number, memory: number): ComputeCapacity {
        const compute_capacity = new ComputeCapacity();
        compute_capacity.cpu = cpu;
        compute_capacity.memory = memory * 1024 ** 2;
        return compute_capacity;
    }
    _createNetworkInterface(networkName: string, ip: string): ZNetworkInterface {
        const znetwork_interface = new ZNetworkInterface();
        znetwork_interface.network = networkName;
        znetwork_interface.ip = ip;
        return znetwork_interface;
    }
    _createMachineNetwork(networkName: string, ip: string, planetary: boolean, public_ip = ""): ZmachineNetwork {
        const zmachine_network = new ZmachineNetwork();
        zmachine_network.planetary = planetary;
        zmachine_network.interfaces = [this._createNetworkInterface(networkName, ip)];
        zmachine_network.public_ip = public_ip;
        return zmachine_network;
    }
    create(
        name: string,
        flist: string,
        cpu: number,
        memory: number,
        rootfs_size: number,
        disks: Mount[],
        networkName: string,
        ip: string,
        planetary: boolean,
        public_ip: string,
        entrypoint: string,
        env: Record<string, unknown>,
        metadata = "",
        description = "",
        version = 0,
        corex = false,
    ): Workload {
        const zmachine = new Zmachine();
        zmachine.flist = flist;
        zmachine.network = this._createMachineNetwork(networkName, ip, planetary, public_ip);
        zmachine.size = rootfs_size * 1024 ** 3;
        zmachine.mounts = disks;
        zmachine.entrypoint = entrypoint;
        zmachine.compute_capacity = this._createComputeCapacity(cpu, memory);
        zmachine.env = env;
        zmachine.corex = corex;

        const zmachine_workload = new Workload();
        zmachine_workload.version = version || 0;
        zmachine_workload.name = name;
        zmachine_workload.type = WorkloadTypes.zmachine;
        zmachine_workload.data = zmachine;
        zmachine_workload.metadata = metadata;
        zmachine_workload.description = description;
        return zmachine_workload;
    }
}

export { VMPrimitive };
