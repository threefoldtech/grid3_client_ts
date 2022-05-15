"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QSFSPrimitive = void 0;
const buffer_1 = require("buffer");
const md5_1 = __importDefault(require("crypto-js/md5"));
const qsfs_1 = require("../zos/qsfs");
const workload_1 = require("../zos/workload");
const zmachine_1 = require("../zos/zmachine");
class QSFSPrimitive {
    createMount(name, mountpoint) {
        const mount = new zmachine_1.Mount();
        mount.name = name;
        mount.mountpoint = mountpoint;
        return mount;
    }
    create(name, minimalShards, expectedShards, metaPrefix, metaBackends, groups, encryptionKey, cache = 1, // 1 GB for qsfs
    maxZdbDataDirSize = 32, // in MB
    metaType = "zdb", redundantGroups = 0, redundantNodes = 0, encryptionAlgorithm = "AES", compressionAlgorithm = "snappy", metadata = "", description = "", version = 0) {
        const key = (0, md5_1.default)(encryptionKey).toString();
        const hexKey = buffer_1.Buffer.from(key).toString("hex");
        const encryption = new qsfs_1.Encryption();
        encryption.algorithm = encryptionAlgorithm;
        encryption.key = hexKey;
        const quantumSafeConfig = new qsfs_1.QuantumSafeConfig();
        quantumSafeConfig.prefix = metaPrefix;
        quantumSafeConfig.encryption = encryption;
        quantumSafeConfig.backends = metaBackends;
        const quantumSafeMeta = new qsfs_1.QuantumSafeMeta();
        quantumSafeMeta.type = metaType;
        quantumSafeMeta.config = quantumSafeConfig;
        const quantumCompression = new qsfs_1.QuantumCompression();
        quantumCompression.algorithm = compressionAlgorithm;
        const quantumSafeFSConfig = new qsfs_1.QuantumSafeFSConfig();
        quantumSafeFSConfig.minimal_shards = minimalShards;
        quantumSafeFSConfig.expected_shards = expectedShards;
        quantumSafeFSConfig.redundant_groups = redundantGroups;
        quantumSafeFSConfig.redundant_nodes = redundantNodes;
        quantumSafeFSConfig.max_zdb_data_dir_size = maxZdbDataDirSize;
        quantumSafeFSConfig.encryption = encryption;
        quantumSafeFSConfig.meta = quantumSafeMeta;
        quantumSafeFSConfig.groups = groups;
        quantumSafeFSConfig.compression = quantumCompression;
        const quantumSafeFS = new qsfs_1.QuantumSafeFS();
        quantumSafeFS.cache = cache * 1024 ** 3;
        quantumSafeFS.config = quantumSafeFSConfig;
        const qsfs_workload = new workload_1.Workload();
        qsfs_workload.version = version;
        qsfs_workload.name = name;
        qsfs_workload.type = workload_1.WorkloadTypes.qsfs;
        qsfs_workload.data = quantumSafeFS;
        qsfs_workload.metadata = metadata;
        qsfs_workload.description = description;
        return qsfs_workload;
    }
}
exports.QSFSPrimitive = QSFSPrimitive;
