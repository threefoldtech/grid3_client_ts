import { Workload } from "../zos/workload";
declare class PublicIPPrimitive {
    create(name: string, metadata?: string, description?: string, version?: number, ipv4?: boolean, ipv6?: boolean): Workload;
    update(name: string, metadata?: string, description?: string, old_version?: number): Workload;
}
export { PublicIPPrimitive };
//# sourceMappingURL=publicip.d.ts.map