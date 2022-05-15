"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VMPrimitive = void 0;
const computecapacity_1 = require("../zos/computecapacity");
const workload_1 = require("../zos/workload");
const zmachine_1 = require("../zos/zmachine");
class VMPrimitive {
    _createComputeCapacity(cpu, memory) {
        const compute_capacity = new computecapacity_1.ComputeCapacity();
        compute_capacity.cpu = cpu;
        compute_capacity.memory = memory * 1024 ** 2;
        return compute_capacity;
    }
    _createNetworkInterface(networkName, ip) {
        const znetwork_interface = new zmachine_1.ZNetworkInterface();
        znetwork_interface.network = networkName;
        znetwork_interface.ip = ip;
        return znetwork_interface;
    }
    _createMachineNetwork(networkName, ip, planetary, public_ip = "") {
        const zmachine_network = new zmachine_1.ZmachineNetwork();
        zmachine_network.planetary = planetary;
        zmachine_network.interfaces = [this._createNetworkInterface(networkName, ip)];
        zmachine_network.public_ip = public_ip;
        return zmachine_network;
    }
    create(name, flist, cpu, memory, rootfs_size, disks, networkName, ip, planetary, public_ip, entrypoint, env, metadata = "", description = "", version = 0, corex = false) {
        const zmachine = new zmachine_1.Zmachine();
        zmachine.flist = flist;
        zmachine.network = this._createMachineNetwork(networkName, ip, planetary, public_ip);
        zmachine.size = rootfs_size * 1024 ** 3;
        zmachine.mounts = disks;
        zmachine.entrypoint = entrypoint;
        zmachine.compute_capacity = this._createComputeCapacity(cpu, memory);
        zmachine.env = env;
        zmachine.corex = corex;
        const zmachine_workload = new workload_1.Workload();
        zmachine_workload.version = version || 0;
        zmachine_workload.name = name;
        zmachine_workload.type = workload_1.WorkloadTypes.zmachine;
        zmachine_workload.data = zmachine;
        zmachine_workload.metadata = metadata;
        zmachine_workload.description = description;
        return zmachine_workload;
    }
}
exports.VMPrimitive = VMPrimitive;
