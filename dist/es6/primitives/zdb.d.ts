import { ZdbModes } from "../zos/zdb";
import { Workload } from "../zos/workload";
declare class ZdbPrimitive {
    create(name: string, size: number, mode: ZdbModes, password: string, publicIpv6: boolean, metadata?: string, description?: string, version?: number): Workload;
    update(name: string, size: number, mode: ZdbModes, password: string, publicIpv6: boolean, metadata?: string, description?: string, version?: number): Workload;
}
export { ZdbPrimitive };
//# sourceMappingURL=zdb.d.ts.map