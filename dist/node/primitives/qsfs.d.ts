import { ZdbBackend, ZdbGroup } from "../zos/qsfs";
import { Workload } from "../zos/workload";
import { Mount } from "../zos/zmachine";
declare class QSFSPrimitive {
    createMount(name: string, mountpoint: string): Mount;
    create(name: string, minimalShards: number, expectedShards: number, metaPrefix: string, metaBackends: ZdbBackend[], groups: ZdbGroup[], encryptionKey: string, cache?: number, // 1 GB for qsfs
    maxZdbDataDirSize?: number, // in MB
    metaType?: string, redundantGroups?: number, redundantNodes?: number, encryptionAlgorithm?: string, compressionAlgorithm?: string, metadata?: string, description?: string, version?: number): Workload;
}
export { QSFSPrimitive };
//# sourceMappingURL=qsfs.d.ts.map