class Encryption {
    challenge() {
        let out = "";
        out += this.algorithm;
        out += this.key;
        return out;
    }
}
class ZdbBackend {
    challenge() {
        let out = "";
        out += this.address;
        out += this.namespace;
        out += this.password;
        return out;
    }
}
class QuantumSafeConfig {
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
    challenge() {
        let out = "";
        out += this.type;
        out += this.config.challenge();
        return out;
    }
}
class ZdbGroup {
    challenge() {
        let out = "";
        for (const backend of this.backends) {
            out += backend.challenge();
        }
        return out;
    }
}
class QuantumCompression {
    challenge() {
        return this.algorithm;
    }
}
class QuantumSafeFSConfig {
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
    challenge() {
        let out = "";
        out += this.cache;
        out += this.config.challenge();
        return out;
    }
}
class QuatumSafeFSResult {
}
export { QuantumSafeFS, ZdbBackend, ZdbGroup, QuantumSafeFSConfig, Encryption, QuantumSafeMeta, QuantumSafeConfig, QuantumCompression };
