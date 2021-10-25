import { default as md5 } from "crypto-js/md5";
import { Buffer } from "buffer";

import { WorkloadTypes, Workload } from "../zos/workload";
import {
    QuantumSafeFS,
    ZdbBackend,
    ZdbGroup,
    QuantumSafeFSConfig,
    Encryption,
    QuantumSafeMeta,
    QuantumSafeConfig,
    QuantumCompression,
} from "../zos/qsfs";
import { Mount } from "../zos/zmachine";

class QSFSPrimitive {
    createMount(name: string, mountpoint: string): Mount {
        const mount = new Mount();
        mount.name = name;
        mount.mountpoint = mountpoint;
        return mount;
    }
    create(
        name: string,
        minimalShards: number,
        expectedShards: number,
        metaPrefix: string,
        metaBackends: ZdbBackend[],
        groups: ZdbGroup[],
        encryptionKey: string,
        metaType = "zdb",
        cache = 1, // 1 GB for qsfs
        maxZdbDataDirSize = 32, // in MB
        redundantGroups = 1,
        redundantNodes = 1,
        encryptionAlgorithm = "AES",
        compressionAlgorithm = "snappy",
        metadata = "",
        description = "",
        version = 0,
    ): Workload {
        const key = md5(encryptionKey).toString();
        const encryption = new Encryption();
        encryption.algorithm = encryptionAlgorithm;
        encryption.key = key;

        const quantumSafeConfig = new QuantumSafeConfig();
        quantumSafeConfig.prefix = metaPrefix;
        quantumSafeConfig.encryption = encryption;
        quantumSafeConfig.backends = metaBackends;

        const quantumSafeMeta = new QuantumSafeMeta();
        quantumSafeMeta.type = metaType;
        quantumSafeMeta.config = quantumSafeConfig;

        const quantumCompression = new QuantumCompression();
        quantumCompression.algorithm = compressionAlgorithm;

        const quantumSafeFSConfig = new QuantumSafeFSConfig();
        quantumSafeFSConfig.minimal_shards = minimalShards;
        quantumSafeFSConfig.expected_shards = expectedShards;
        quantumSafeFSConfig.redundant_groups = redundantGroups;
        quantumSafeFSConfig.redundant_nodes = redundantNodes;
        quantumSafeFSConfig.max_zdb_data_dir_size = maxZdbDataDirSize;
        quantumSafeFSConfig.encryption = encryption;
        quantumSafeFSConfig.meta = quantumSafeMeta;
        quantumSafeFSConfig.groups = groups;
        quantumSafeFSConfig.compression = quantumCompression;

        const quantumSafeFS = new QuantumSafeFS();
        quantumSafeFS.cache = cache * 1024 * 1024 * 1024;
        quantumSafeFS.config = quantumSafeFSConfig;

        const qsfs_workload = new Workload();
        qsfs_workload.version = version;
        qsfs_workload.name = name;
        qsfs_workload.type = WorkloadTypes.qsfs;
        qsfs_workload.data = quantumSafeFS;
        qsfs_workload.metadata = metadata;
        qsfs_workload.description = description;
        return qsfs_workload;
    }
}

export { QSFSPrimitive };
