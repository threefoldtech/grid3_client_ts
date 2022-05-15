import { QSFSDiskModel } from "../modules/models";
import { Network } from "../primitives/network";
import { Deployment } from "../zos/deployment";
import { HighLevelBase } from "./base";
declare class KubernetesHL extends HighLevelBase {
    add_master(name: string, nodeId: number, secret: string, cpu: number, memory: number, rootfs_size: number, diskSize: number, publicIp: boolean, publicIp6: boolean, planetary: boolean, network: Network, sshKey: string, metadata?: string, description?: string, qsfs_disks?: QSFSDiskModel[], qsfsProjectName?: string, addAccess?: boolean, ip?: string, corex?: boolean): Promise<[import("./models").TwinDeployment[], string]>;
    add_worker(name: string, nodeId: number, secret: string, masterIp: string, cpu: number, memory: number, rootfs_size: number, diskSize: number, publicIp: boolean, publicIp6: boolean, planetary: boolean, network: Network, sshKey: string, metadata?: string, description?: string, qsfs_disks?: QSFSDiskModel[], qsfsProjectName?: string, addAccess?: boolean, ip?: string, corex?: boolean): Promise<[import("./models").TwinDeployment[], string]>;
    delete(deployment: Deployment, names: string[]): Promise<import("./models").TwinDeployment[]>;
}
export { KubernetesHL };
//# sourceMappingURL=kubernetes.d.ts.map