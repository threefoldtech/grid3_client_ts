import { Deployment } from "../zos/deployment";
import { TwinDeployment } from "./models";
import { HighLevelBase } from "./base";
import { Network } from "../primitives/index";
import { DiskModel, QSFSDisk } from "../modules/models";
declare class VMHL extends HighLevelBase {
    create(name: string, nodeId: number, flist: string, cpu: number, memory: number, rootfs_size: number, disks: DiskModel[], publicIp: boolean, planetary: boolean, network: Network, entrypoint: string, env: Record<string, unknown>, metadata?: string, description?: string, qsfsDisks?: QSFSDisk[], qsfsProjectName?: string): Promise<[TwinDeployment[], string]>;
    delete(deployment: Deployment, names: string[]): Promise<TwinDeployment[]>;
}
export { VMHL };
//# sourceMappingURL=machine.d.ts.map