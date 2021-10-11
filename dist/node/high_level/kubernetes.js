"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Kubernetes = void 0;
const workload_1 = require("../zos/workload");
const machine_1 = require("../high_level//machine");
const base_1 = require("./base");
const Flist = "https://hub.grid.tf/ahmed_hanafy_1/ahmedhanafy725-k3s-latest.flist";
class Kubernetes extends base_1.HighLevelBase {
    async add_master(name, nodeId, secret, cpu, memory, rootfs_size, diskSize, publicIp, planetary, network, sshKey, metadata = "", description = "") {
        console.log(`Creating a master with name: ${name} on node: ${nodeId}, network: ${network.name}`);
        const machine = new machine_1.VirtualMachine(this.twin_id, this.url, this.mnemonic, this.rmbClient);
        const mountpoint = "/mnt/data";
        const env = {
            SSH_KEY: sshKey,
            K3S_TOKEN: secret,
            K3S_DATA_DIR: mountpoint,
            K3S_FLANNEL_IFACE: "eth0",
            K3S_NODE_NAME: name,
            K3S_URL: "",
        };
        const disk = {
            name: `${name}_disk`,
            size: diskSize,
            mountpoint: mountpoint,
        };
        return await machine.create(name, nodeId, Flist, cpu, memory, rootfs_size, [disk], publicIp, planetary, network, "/sbin/zinit init", env, metadata, description);
    }
    async add_worker(name, nodeId, secret, masterIp, cpu, memory, rootfs_size, diskSize, publicIp, planetary, network, sshKey, metadata = "", description = "") {
        console.log(`Creating a worker with name: ${name} on node: ${nodeId}, network: ${network.name}`);
        const machine = new machine_1.VirtualMachine(this.twin_id, this.url, this.mnemonic, this.rmbClient);
        const mountpoint = "/mnt/data";
        const env = {
            SSH_KEY: sshKey,
            K3S_TOKEN: secret,
            K3S_DATA_DIR: mountpoint,
            K3S_FLANNEL_IFACE: "eth0",
            K3S_NODE_NAME: name,
            K3S_URL: `https://${masterIp}:6443`,
        };
        const disk = {
            name: `${name}_disk`,
            size: diskSize,
            mountpoint: mountpoint,
        };
        return await machine.create(name, nodeId, Flist, cpu, memory, rootfs_size, [disk], publicIp, planetary, network, "/sbin/zinit init", env, metadata, description);
    }
    async delete(deployment, names) {
        return await this._delete(deployment, names, [
            workload_1.WorkloadTypes.zmachine,
            workload_1.WorkloadTypes.zmount,
            workload_1.WorkloadTypes.ipv4,
        ]);
    }
}
exports.Kubernetes = Kubernetes;
