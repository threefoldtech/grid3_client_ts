import { Workload } from "../zos/workload";
declare class GW {
    createFQDN(fqdn: string, tls_passthrough: boolean, backends: string[], name: string, metadata?: string, description?: string, version?: number): Workload;
    updateFQDN(fqdn: string, tls_passthrough: boolean, backends: string[], name: string, metadata?: string, description?: string, old_version?: number): Workload;
    createName(name: string, tls_passthrough: boolean, backends: string[], metadata?: string, description?: string, version?: number): Workload;
    updateName(name: string, tls_passthrough: boolean, backends: string[], metadata?: string, description?: string, old_version?: number): Workload;
}
export { GW };
