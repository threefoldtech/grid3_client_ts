import { DiskModel, QSFSDiskModel } from "../modules/models";
import { Network } from "../primitives/index";
import { Deployment } from "../zos/deployment";
import { HighLevelBase } from "./base";
import { TwinDeployment } from "./models";
declare class VMHL extends HighLevelBase {
    create(name: string, nodeId: number, flist: string, cpu: number, memory: number, rootfs_size: number, disks: DiskModel[], publicIp: boolean, publicIp6: boolean, planetary: boolean, network: Network, entrypoint: string, env: Record<string, unknown>, metadata?: string, description?: string, qsfsDisks?: QSFSDiskModel[], qsfsProjectName?: string, addAccess?: boolean, ip?: string, corex?: boolean): Promise<[TwinDeployment[], string]>;
    delete(deployment: Deployment, names: string[]): Promise<TwinDeployment[]>;
}
export { VMHL };
//# sourceMappingURL=machine.d.ts.map