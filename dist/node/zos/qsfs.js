"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuantumSafeFSResult = exports.QuantumCompression = exports.QuantumSafeConfig = exports.QuantumSafeMeta = exports.Encryption = exports.QuantumSafeFSConfig = exports.ZdbGroup = exports.ZdbBackend = exports.QuantumSafeFS = void 0;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const workload_base_1 = require("./workload_base");
class Encryption {
    algorithm;
    key;
    challenge() {
        let out = "";
        out += this.algorithm;
        out += this.key;
        return out;
    }
}
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Encryption.prototype, "algorithm", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Encryption.prototype, "key", void 0);
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
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ZdbBackend.prototype, "address", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ZdbBackend.prototype, "namespace", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ZdbBackend.prototype, "password", void 0);
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
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], QuantumSafeConfig.prototype, "prefix", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_transformer_1.Type)(() => Encryption),
    (0, class_validator_1.ValidateNested)(),
    __metadata("design:type", Encryption)
], QuantumSafeConfig.prototype, "encryption", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_transformer_1.Type)(() => ZdbBackend),
    (0, class_validator_1.ValidateNested)({ each: true }),
    __metadata("design:type", Array)
], QuantumSafeConfig.prototype, "backends", void 0);
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
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], QuantumSafeMeta.prototype, "type", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_transformer_1.Type)(() => QuantumSafeConfig),
    (0, class_validator_1.ValidateNested)(),
    __metadata("design:type", QuantumSafeConfig)
], QuantumSafeMeta.prototype, "config", void 0);
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
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_transformer_1.Type)(() => ZdbBackend),
    (0, class_validator_1.ValidateNested)({ each: true }),
    __metadata("design:type", Array)
], ZdbGroup.prototype, "backends", void 0);
exports.ZdbGroup = ZdbGroup;
class QuantumCompression {
    algorithm;
    challenge() {
        return this.algorithm;
    }
}
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], QuantumCompression.prototype, "algorithm", void 0);
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
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], QuantumSafeFSConfig.prototype, "minimal_shards", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(2),
    __metadata("design:type", Number)
], QuantumSafeFSConfig.prototype, "expected_shards", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], QuantumSafeFSConfig.prototype, "redundant_groups", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], QuantumSafeFSConfig.prototype, "redundant_nodes", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], QuantumSafeFSConfig.prototype, "max_zdb_data_dir_size", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_transformer_1.Type)(() => Encryption),
    (0, class_validator_1.ValidateNested)(),
    __metadata("design:type", Encryption)
], QuantumSafeFSConfig.prototype, "encryption", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_transformer_1.Type)(() => QuantumSafeMeta),
    (0, class_validator_1.ValidateNested)(),
    __metadata("design:type", QuantumSafeMeta)
], QuantumSafeFSConfig.prototype, "meta", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_transformer_1.Type)(() => ZdbGroup),
    (0, class_validator_1.ValidateNested)({ each: true }),
    __metadata("design:type", Array)
], QuantumSafeFSConfig.prototype, "groups", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_transformer_1.Type)(() => QuantumCompression),
    (0, class_validator_1.ValidateNested)(),
    __metadata("design:type", QuantumCompression)
], QuantumSafeFSConfig.prototype, "compression", void 0);
exports.QuantumSafeFSConfig = QuantumSafeFSConfig;
class QuantumSafeFS extends workload_base_1.WorkloadData {
    cache;
    config;
    challenge() {
        let out = "";
        out += this.cache;
        out += this.config.challenge();
        return out;
    }
}
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(250 * 1024 ** 2),
    __metadata("design:type", Number)
], QuantumSafeFS.prototype, "cache", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_transformer_1.Type)(() => QuantumSafeFSConfig),
    (0, class_validator_1.ValidateNested)(),
    __metadata("design:type", QuantumSafeFSConfig)
], QuantumSafeFS.prototype, "config", void 0);
exports.QuantumSafeFS = QuantumSafeFS;
class QuantumSafeFSResult extends workload_base_1.WorkloadDataResult {
    path;
    metrics_endpoint;
}
exports.QuantumSafeFSResult = QuantumSafeFSResult;
