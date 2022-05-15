import { Workload } from "../zos/workload";
import { ZdbModes } from "../zos/zdb";
declare class ZdbPrimitive {
    create(name: string, size: number, mode: ZdbModes, password: string, publicNamespace: boolean, metadata?: string, description?: string, version?: number): Workload;
    update(name: string, size: number, mode: ZdbModes, password: string, publicNamespace: boolean, metadata?: string, description?: string, version?: number): Workload;
}
export { ZdbPrimitive };
//# sourceMappingURL=zdb.d.ts.map