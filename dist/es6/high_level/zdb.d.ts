import { ZdbModes } from "../zos/zdb";
import { Deployment } from "../zos/deployment";
import { HighLevelBase } from "./base";
import { TwinDeployment } from "../high_level/models";
declare class ZdbHL extends HighLevelBase {
    create(name: string, node_id: number, disk_size: number, mode: ZdbModes, password: string, publicIpv6: boolean, metadata?: string, description?: string): TwinDeployment;
    delete(deployment: Deployment, names: string[]): Promise<TwinDeployment[]>;
}
export { ZdbHL };
//# sourceMappingURL=zdb.d.ts.map