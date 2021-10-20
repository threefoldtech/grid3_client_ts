import { ZdbModes, DeviceTypes } from "../zos/zdb";
import { Workload } from "../zos/workload";
declare class ZdbPrimitive {
    create(name: string, namespace: string, size: number, mode: ZdbModes, password: string, type: DeviceTypes, pub: boolean, metadata?: string, description?: string, version?: number): Workload;
    update(name: string, namespace: string, size: number, mode: ZdbModes, password: string, type: DeviceTypes, pub: boolean, metadata?: string, description?: string, version?: number): Workload;
}
export { ZdbPrimitive };
//# sourceMappingURL=zdb.d.ts.map