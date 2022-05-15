import { TwinDeployment } from "../high_level/models";
import { Deployment } from "../zos/deployment";
import { ZdbModes } from "../zos/zdb";
import { HighLevelBase } from "./base";
declare class ZdbHL extends HighLevelBase {
    create(name: string, node_id: number, disk_size: number, mode: ZdbModes, password: string, publicNamespace: boolean, metadata?: string, description?: string): Promise<TwinDeployment>;
    delete(deployment: Deployment, names: string[]): Promise<TwinDeployment[]>;
}
export { ZdbHL };
//# sourceMappingURL=zdb.d.ts.map