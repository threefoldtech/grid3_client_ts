var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { IsString, IsNotEmpty, IsInt, Min, ValidateNested } from "class-validator";
class Encryption {
    challenge() {
        let out = "";
        out += this.algorithm;
        out += this.key;
        return out;
    }
}
__decorate([
    IsNotEmpty(),
    IsString()
], Encryption.prototype, "algorithm", void 0);
__decorate([
    IsNotEmpty(),
    IsString()
], Encryption.prototype, "key", void 0);
class ZdbBackend {
    challenge() {
        let out = "";
        out += this.address;
        out += this.namespace;
        out += this.password;
        return out;
    }
}
__decorate([
    IsNotEmpty(),
    IsString()
], ZdbBackend.prototype, "address", void 0);
__decorate([
    IsNotEmpty(),
    IsString()
], ZdbBackend.prototype, "namespace", void 0);
__decorate([
    IsNotEmpty(),
    IsString()
], ZdbBackend.prototype, "password", void 0);
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
__decorate([
    IsNotEmpty(),
    IsString()
], QuantumSafeConfig.prototype, "prefix", void 0);
__decorate([
    ValidateNested()
], QuantumSafeConfig.prototype, "encryption", void 0);
__decorate([
    ValidateNested({ each: true })
], QuantumSafeConfig.prototype, "backends", void 0);
class QuantumSafeMeta {
    challenge() {
        let out = "";
        out += this.type;
        out += this.config.challenge();
        return out;
    }
}
__decorate([
    IsNotEmpty(),
    IsString()
], QuantumSafeMeta.prototype, "type", void 0);
__decorate([
    ValidateNested()
], QuantumSafeMeta.prototype, "config", void 0);
class ZdbGroup {
    challenge() {
        let out = "";
        for (const backend of this.backends) {
            out += backend.challenge();
        }
        return out;
    }
}
__decorate([
    ValidateNested({ each: true })
], ZdbGroup.prototype, "backends", void 0);
class QuantumCompression {
    challenge() {
        return this.algorithm;
    }
}
__decorate([
    IsNotEmpty(),
    IsString()
], QuantumCompression.prototype, "algorithm", void 0);
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
__decorate([
    IsInt(),
    Min(2)
], QuantumSafeFSConfig.prototype, "minimal_shards", void 0);
__decorate([
    IsInt(),
    Min(1)
], QuantumSafeFSConfig.prototype, "expected_shards", void 0);
__decorate([
    IsInt(),
    Min(1)
], QuantumSafeFSConfig.prototype, "redundant_groups", void 0);
__decorate([
    IsInt(),
    Min(1)
], QuantumSafeFSConfig.prototype, "redundant_nodes", void 0);
__decorate([
    IsInt(),
    Min(1)
], QuantumSafeFSConfig.prototype, "max_zdb_data_dir_size", void 0);
__decorate([
    ValidateNested()
], QuantumSafeFSConfig.prototype, "encryption", void 0);
__decorate([
    ValidateNested()
], QuantumSafeFSConfig.prototype, "meta", void 0);
__decorate([
    ValidateNested({ each: true })
], QuantumSafeFSConfig.prototype, "groups", void 0);
__decorate([
    ValidateNested()
], QuantumSafeFSConfig.prototype, "compression", void 0);
class QuantumSafeFS {
    challenge() {
        let out = "";
        out += this.cache;
        out += this.config.challenge();
        return out;
    }
}
__decorate([
    IsInt(),
    Min(1024 * 1024 * 250)
], QuantumSafeFS.prototype, "cache", void 0);
__decorate([
    ValidateNested()
], QuantumSafeFS.prototype, "config", void 0);
class QuatumSafeFSResult {
}
export { QuantumSafeFS, ZdbBackend, ZdbGroup, QuantumSafeFSConfig, Encryption, QuantumSafeMeta, QuantumSafeConfig, QuantumCompression, };
