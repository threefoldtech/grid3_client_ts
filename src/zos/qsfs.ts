class Encryption {
    algorithm: string;
    key: string; // hex or bytes ?

    challenge() {
        let out = "";
        out += this.algorithm;
        out += this.key;
        return out;
    }
}

class ZdbBackend {
    address: string;
    namespace: string;
    password: string;

    challenge() {
        let out = "";
        out += this.address;
        out += this.namespace;
        out += this.password;
        return out;
    }
}

class QuantumSafeConfig {
    prefix: string;
    encryption: Encryption;
    backends: ZdbBackend[];

    challenge() {
        let out = "";
        out += this.prefix;
        out += this.encryption.challenge();
        for (const backend of this.backends) {
            out += backend.challenge();
        }
        return out;
    }
}

class QuantumSafeMeta {
    type: string;
    config: QuantumSafeConfig;

    challenge() {
        let out = "";
        out += this.type;
        out += this.config.challenge();
        return out;
    }
}

class ZdbGroup {
    backends: ZdbBackend[];
    challenge() {
        let out = "";
        for (const backend of this.backends) {
            out += backend.challenge();
        }
        return out;
    }
}

class QuantumCompression {
    algorithm: string;
    challenge() {
        return this.algorithm;
    }
}

class QuantumSafeFSConfig {
    minimal_shards: number;
    expected_shards: number;
    redundant_groups: number;
    redundant_nodes: number;
    max_zdb_data_dir_size: number;
    encryption: Encryption;
    meta: QuantumSafeMeta;
    groups: ZdbGroup[];
    compression: QuantumCompression;

    challenge() {
        let out = "";
        out += this.minimal_shards;
        out += this.expected_shards;
        out += this.redundant_groups;
        out += this.redundant_nodes;
        out += this.max_zdb_data_dir_size;
        out += this.encryption.challenge();
        out += this.meta.challenge();
        for (const group of this.groups) {
            out += group.challenge();
        }
        out += this.compression.challenge();
        return out;
    }
}

class QuantumSafeFS {
    cache: number; // is it number ?
    config: QuantumSafeFSConfig;
    challenge() {
        let out = "";
        out += this.cache;
        out += this.config.challenge();
        return out;
    }
}

class QuatumSafeFSResult {
    path: string;
    metrics_endpoint: string;
}

export {
    QuantumSafeFS,
    ZdbBackend,
    ZdbGroup,
    QuantumSafeFSConfig,
    Encryption,
    QuantumSafeMeta,
    QuantumSafeConfig,
    QuantumCompression,
};
