import { DeviceTypes, ZdbModes } from "../zos/zdb";
import { Deployment } from "../zos/deployment";
import { HighLevelBase } from "./base";
import { TwinDeployment } from "../high_level/models";
declare class Zdb extends HighLevelBase {
    create(name: string, node_id: number, namespace: string, disk_size: number, disk_type: DeviceTypes, mode: ZdbModes, password: string, publicIpv6: boolean, metadata?: string, description?: string): TwinDeployment;
    delete(deployment: Deployment, names: string[]): Promise<TwinDeployment[]>;
}
export { Zdb };
