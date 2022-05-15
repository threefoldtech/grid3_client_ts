var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Expose, Type } from "class-transformer";
import { IsInt, IsNotEmpty, IsString, Min, ValidateNested } from "class-validator";
import { WorkloadData, WorkloadDataResult } from "./workload_base";
class Encryption {
    challenge() {
        let out = "";
        out += this.algorithm;
        out += this.key;
        return out;
    }
}
__decorate([
    Expose(),
    IsNotEmpty(),
    IsString(),
    __metadata("design:type", String)
], Encryption.prototype, "algorithm", void 0);
__decorate([
    Expose(),
    IsNotEmpty(),
    IsString(),
    __metadata("design:type", String)
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
    Expose(),
    IsNotEmpty(),
    IsString(),
    __metadata("design:type", String)
], ZdbBackend.prototype, "address", void 0);
__decorate([
    Expose(),
    IsNotEmpty(),
    IsString(),
    __metadata("design:type", String)
], ZdbBackend.prototype, "namespace", void 0);
__decorate([
    Expose(),
    IsNotEmpty(),
    IsString(),
    __metadata("design:type", String)
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
    Expose(),
    IsNotEmpty(),
    IsString(),
    __metadata("design:type", String)
], QuantumSafeConfig.prototype, "prefix", void 0);
__decorate([
    Expose(),
    Type(() => Encryption),
    ValidateNested(),
    __metadata("design:type", Encryption)
], QuantumSafeConfig.prototype, "encryption", void 0);
__decorate([
    Expose(),
    Type(() => ZdbBackend),
    ValidateNested({ each: true }),
    __metadata("design:type", Array)
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
    Expose(),
    IsNotEmpty(),
    IsString(),
    __metadata("design:type", String)
], QuantumSafeMeta.prototype, "type", void 0);
__decorate([
    Expose(),
    Type(() => QuantumSafeConfig),
    ValidateNested(),
    __metadata("design:type", QuantumSafeConfig)
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
    Expose(),
    Type(() => ZdbBackend),
    ValidateNested({ each: true }),
    __metadata("design:type", Array)
], ZdbGroup.prototype, "backends", void 0);
class QuantumCompression {
    challenge() {
        return this.algorithm;
    }
}
__decorate([
    Expose(),
    IsNotEmpty(),
    IsString(),
    __metadata("design:type", String)
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
    Expose(),
    IsInt(),
    Min(1),
    __metadata("design:type", Number)
], QuantumSafeFSConfig.prototype, "minimal_shards", void 0);
__decorate([
    Expose(),
    IsInt(),
    Min(2),
    __metadata("design:type", Number)
], QuantumSafeFSConfig.prototype, "expected_shards", void 0);
__decorate([
    Expose(),
    IsInt(),
    Min(0),
    __metadata("design:type", Number)
], QuantumSafeFSConfig.prototype, "redundant_groups", void 0);
__decorate([
    Expose(),
    IsInt(),
    Min(0),
    __metadata("design:type", Number)
], QuantumSafeFSConfig.prototype, "redundant_nodes", void 0);
__decorate([
    Expose(),
    IsInt(),
    Min(1),
    __metadata("design:type", Number)
], QuantumSafeFSConfig.prototype, "max_zdb_data_dir_size", void 0);
__decorate([
    Expose(),
    Type(() => Encryption),
    ValidateNested(),
    __metadata("design:type", Encryption)
], QuantumSafeFSConfig.prototype, "encryption", void 0);
__decorate([
    Expose(),
    Type(() => QuantumSafeMeta),
    ValidateNested(),
    __metadata("design:type", QuantumSafeMeta)
], QuantumSafeFSConfig.prototype, "meta", void 0);
__decorate([
    Expose(),
    Type(() => ZdbGroup),
    ValidateNested({ each: true }),
    __metadata("design:type", Array)
], QuantumSafeFSConfig.prototype, "groups", void 0);
__decorate([
    Expose(),
    Type(() => QuantumCompression),
    ValidateNested(),
    __metadata("design:type", QuantumCompression)
], QuantumSafeFSConfig.prototype, "compression", void 0);
class QuantumSafeFS extends WorkloadData {
    challenge() {
        let out = "";
        out += this.cache;
        out += this.config.challenge();
        return out;
    }
}
__decorate([
    Expose(),
    IsInt(),
    Min(250 * Math.pow(1024, 2)),
    __metadata("design:type", Number)
], QuantumSafeFS.prototype, "cache", void 0);
__decorate([
    Expose(),
    Type(() => QuantumSafeFSConfig),
    ValidateNested(),
    __metadata("design:type", QuantumSafeFSConfig)
], QuantumSafeFS.prototype, "config", void 0);
class QuantumSafeFSResult extends WorkloadDataResult {
}
export { QuantumSafeFS, ZdbBackend, ZdbGroup, QuantumSafeFSConfig, Encryption, QuantumSafeMeta, QuantumSafeConfig, QuantumCompression, QuantumSafeFSResult, };
