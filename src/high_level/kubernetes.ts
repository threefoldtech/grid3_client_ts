import { Deployment } from "../zos/deployment";
import { WorkloadTypes } from "../zos/workload";

import { Network } from "../primitives/network";
import { VMHL } from "../high_level//machine";
import { HighLevelBase } from "./base";

const Flist = "https://hub.grid.tf/ahmed_hanafy_1/ahmedhanafy725-k3s-latest.flist";

class KubernetesHL extends HighLevelBase {
    async add_master(
        name: string,
        nodeId: number,
        secret: string,
        cpu: number,
        memory: number,
        rootfs_size: number,
        diskSize: number,
        publicIp: boolean,
        planetary: boolean,
        network: Network,
        sshKey: string,
        metadata = "",
        description = "",
    ) {
        console.log(`Creating a master with name: ${name} on node: ${nodeId}, network: ${network.name}`);
        const machine = new VMHL(this.twin_id, this.url, this.mnemonic, this.rmbClient);
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
        return await machine.create(
            name,
            nodeId,
            Flist,
            cpu,
            memory,
            rootfs_size,
            [disk],
            publicIp,
            planetary,
            network,
            "/sbin/zinit init",
            env,
            metadata,
            description,
        );
    }

    async add_worker(
        name: string,
        nodeId: number,
        secret: string,
        masterIp: string,
        cpu: number,
        memory: number,
        rootfs_size: number,
        diskSize: number,
        publicIp: boolean,
        planetary: boolean,
        network: Network,
        sshKey: string,
        metadata = "",
        description = "",
    ) {
        console.log(`Creating a worker with name: ${name} on node: ${nodeId}, network: ${network.name}`);
        const machine = new VMHL(this.twin_id, this.url, this.mnemonic, this.rmbClient);
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
        return await machine.create(
            name,
            nodeId,
            Flist,
            cpu,
            memory,
            rootfs_size,
            [disk],
            publicIp,
            planetary,
            network,
            "/sbin/zinit init",
            env,
            metadata,
            description,
        );
    }

    async delete(deployment: Deployment, names: string[]) {
        return await this._delete(deployment, names, [
            WorkloadTypes.zmachine,
            WorkloadTypes.zmount,
            WorkloadTypes.ipv4,
        ]);
    }
}
export { KubernetesHL };
