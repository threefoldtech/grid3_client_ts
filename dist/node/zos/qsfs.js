"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuantumCompression = exports.QuantumSafeConfig = exports.QuantumSafeMeta = exports.Encryption = exports.QuantumSafeFSConfig = exports.ZdbGroup = exports.ZdbBackend = exports.QuantumSafeFS = void 0;
class Encryption {
    algorithm;
    key; // hex or bytes ?
    challenge() {
        let out = "";
        out += this.algorithm;
        out += this.key;
        return out;
    }
}
exports.Encryption = Encryption;
class ZdbBackend {
    address;
    namespace;
    password;
    challenge() {
        let out = "";
        out += this.address;
        out += this.namespace;
        out += this.password;
        return out;
    }
}
exports.ZdbBackend = ZdbBackend;
class QuantumSafeConfig {
    prefix;
    encryption;
    backends;
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
exports.QuantumSafeConfig = QuantumSafeConfig;
class QuantumSafeMeta {
    type;
    config;
    challenge() {
        let out = "";
        out += this.type;
        out += this.config.challenge();
        return out;
    }
}
exports.QuantumSafeMeta = QuantumSafeMeta;
class ZdbGroup {
    backends;
    challenge() {
        let out = "";
        for (const backend of this.backends) {
            out += backend.challenge();
        }
        return out;
    }
}
exports.ZdbGroup = ZdbGroup;
class QuantumCompression {
    algorithm;
    challenge() {
        return this.algorithm;
    }
}
exports.QuantumCompression = QuantumCompression;
class QuantumSafeFSConfig {
    minimal_shards;
    expected_shards;
    redundant_groups;
    redundant_nodes;
    max_zdb_data_dir_size;
    encryption;
    meta;
    groups;
    compression;
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
exports.QuantumSafeFSConfig = QuantumSafeFSConfig;
class QuantumSafeFS {
    cache; // is it number ?
    config;
    challenge() {
        let out = "";
        out += this.cache;
        out += this.config.challenge();
        return out;
    }
}
exports.QuantumSafeFS = QuantumSafeFS;
class QuatumSafeFSResult {
    path;
    metrics_endpoint;
}
