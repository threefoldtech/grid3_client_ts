import { default as md5 } from "crypto-js/md5";
import { Buffer } from "buffer";
import { WorkloadTypes, Workload } from "../zos/workload";
import { QuantumSafeFS, QuantumSafeFSConfig, Encryption, QuantumSafeMeta, QuantumSafeConfig, QuantumCompression, } from "../zos/qsfs";
import { Mount } from "../zos/zmachine";
class QSFSPrimitive {
    createMount(name, mountpoint) {
        const mount = new Mount();
        mount.name = name;
        mount.mountpoint = mountpoint;
        return mount;
    }
    create(name, minimalShards, expectedShards, metaPrefix, metaBackends, groups, encryptionKey, metaType = "zdb", cache = 1024 * 1024 * 1024, // 1 GB for qsfs
    maxZdbDataDirSize = 32, // in MB
    redundantGroups = 1, redundantNodes = 1, encryptionAlgorithm = "AES", compressionAlgorithm = "snappy", metadata = "", description = "", version = 0) {
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
        quantumSafeFS.cache = cache;
        quantumSafeFS.config = quantumSafeFSConfig;
        const zmount_workload = new Workload();
        zmount_workload.version = version;
        zmount_workload.name = name;
        zmount_workload.type = WorkloadTypes.qsfs;
        zmount_workload.data = quantumSafeFS;
        zmount_workload.metadata = metadata;
        zmount_workload.description = description;
        return zmount_workload;
    }
}
export { QSFSPrimitive };
