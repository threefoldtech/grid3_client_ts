declare class Encryption {
    algorithm: string;
    key: string;
    challenge(): string;
}
declare class ZdbBackend {
    address: string;
    namespace: string;
    password: string;
    challenge(): string;
}
declare class QuantumSafeConfig {
    prefix: string;
    encryption: Encryption;
    backends: ZdbBackend[];
    challenge(): string;
}
declare class QuantumSafeMeta {
    type: string;
    config: QuantumSafeConfig;
    challenge(): string;
}
declare class ZdbGroup {
    backends: ZdbBackend[];
    challenge(): string;
}
declare class QuantumCompression {
    algorithm: string;
    challenge(): string;
}
declare class QuantumSafeFSConfig {
    minimal_shards: number;
    expected_shards: number;
    redundant_groups: number;
    redundant_nodes: number;
    max_zdb_data_dir_size: number;
    encryption: Encryption;
    meta: QuantumSafeMeta;
    groups: ZdbGroup[];
    compression: QuantumCompression;
    challenge(): string;
}
declare class QuantumSafeFS {
    cache: number;
    config: QuantumSafeFSConfig;
    challenge(): string;
}
export { QuantumSafeFS, ZdbBackend, ZdbGroup, QuantumSafeFSConfig, Encryption, QuantumSafeMeta, QuantumSafeConfig, QuantumCompression, };
//# sourceMappingURL=qsfs.d.ts.map