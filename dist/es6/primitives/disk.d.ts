import { Workload } from "../zos/workload";
import { Mount } from "../zos/zmachine";
declare class DiskPrimitive {
    createMount(name: string, mountpoint: string): Mount;
    create(size: number, name: string, metadata?: string, description?: string, version?: number): Workload;
    update(size: number, name: string, metadata?: string, description?: string, old_version?: number): Workload;
}
export { DiskPrimitive };
//# sourceMappingURL=disk.d.ts.map