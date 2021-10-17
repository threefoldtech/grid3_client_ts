import { Deployment } from "../zos/deployment";
import { Network } from "../primitives/network";
import { HighLevelBase } from "./base";
import { QSFSDisk } from "../modules/models";
declare class KubernetesHL extends HighLevelBase {
    add_master(name: string, nodeId: number, secret: string, cpu: number, memory: number, rootfs_size: number, diskSize: number, publicIp: boolean, planetary: boolean, network: Network, sshKey: string, metadata?: string, description?: string, qsfs_disks?: QSFSDisk[], qsfsProjectName?: string): Promise<[import("./models").TwinDeployment[], string]>;
    add_worker(name: string, nodeId: number, secret: string, masterIp: string, cpu: number, memory: number, rootfs_size: number, diskSize: number, publicIp: boolean, planetary: boolean, network: Network, sshKey: string, metadata?: string, description?: string, qsfs_disks?: QSFSDisk[], qsfsProjectName?: string): Promise<[import("./models").TwinDeployment[], string]>;
    delete(deployment: Deployment, names: string[]): Promise<import("./models").TwinDeployment[]>;
}
export { KubernetesHL };
//# sourceMappingURL=kubernetes.d.ts.map