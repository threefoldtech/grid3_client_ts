import { Workload } from "../zos/workload";
declare class IPv4Primitive {
    create(name: string, metadata?: string, description?: string, version?: number): Workload;
    update(name: string, metadata?: string, description?: string, old_version?: number): Workload;
}
export { IPv4Primitive };
//# sourceMappingURL=ipv4.d.ts.map