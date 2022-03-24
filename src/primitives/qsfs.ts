import { Buffer } from "buffer";
import { default as md5 } from "crypto-js/md5";

import {
    Encryption,
    QuantumCompression,
    QuantumSafeConfig,
    QuantumSafeFS,
    QuantumSafeFSConfig,
    QuantumSafeMeta,
    ZdbBackend,
    ZdbGroup,
} from "../zos/qsfs";
import { Workload, WorkloadTypes } from "../zos/workload";
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
        cache = 1, // 1 GB for qsfs
        maxZdbDataDirSize = 32, // in MB
        metaType = "zdb",
        redundantGroups = 0,
        redundantNodes = 0,
        encryptionAlgorithm = "AES",
        compressionAlgorithm = "snappy",
        metadata = "",
        description = "",
        version = 0,
    ): Workload {
        const key = md5(encryptionKey).toString();
        const hexKey = Buffer.from(key).toString("hex");
        const encryption = new Encryption();
        encryption.algorithm = encryptionAlgorithm;
        encryption.key = hexKey;

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
        quantumSafeFS.cache = cache * 1024 ** 3;
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
