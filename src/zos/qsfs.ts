import { IsString, IsNotEmpty, IsInt, Min, ValidateNested } from "class-validator";
import { Expose, Type } from "class-transformer";


import { WorkloadBaseData } from "./workload_base";

class Encryption {
    @Expose() @IsNotEmpty() @IsString() algorithm: string;
    @Expose() @IsNotEmpty() @IsString() key: string;

    challenge() {
        let out = "";
        out += this.algorithm;
        out += this.key;
        return out;
    }
}

class ZdbBackend {
    @Expose() @IsNotEmpty() @IsString() address: string;
    @Expose() @IsNotEmpty() @IsString() namespace: string;
    @Expose() @IsNotEmpty() @IsString() password: string;

    challenge() {
        let out = "";
        out += this.address;
        out += this.namespace;
        out += this.password;
        return out;
    }
}

class QuantumSafeConfig {
    @Expose() @IsNotEmpty() @IsString() prefix: string;
    @Expose() @Type(() => Encryption) @ValidateNested() encryption: Encryption;
    @Expose() @Type(() => ZdbBackend) @ValidateNested({ each: true }) backends: ZdbBackend[];

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
    @Expose() @IsNotEmpty() @IsString() type: string;
    @Expose() @Type(() => QuantumSafeConfig) @ValidateNested() config: QuantumSafeConfig;

    challenge() {
        let out = "";
        out += this.type;
        out += this.config.challenge();
        return out;
    }
}

class ZdbGroup {
    @Expose() @Type(() => ZdbBackend) @ValidateNested({ each: true }) backends: ZdbBackend[];

    challenge() {
        let out = "";
        for (const backend of this.backends) {
            out += backend.challenge();
        }
        return out;
    }
}

class QuantumCompression {
    @Expose() @IsNotEmpty() @IsString() algorithm: string;

    challenge() {
        return this.algorithm;
    }
}

class QuantumSafeFSConfig {
    @Expose() @IsInt() @Min(2) minimal_shards: number;
    @Expose() @IsInt() @Min(1) expected_shards: number;
    @Expose() @IsInt() @Min(1) redundant_groups: number;
    @Expose() @IsInt() @Min(1) redundant_nodes: number;
    @Expose() @IsInt() @Min(1) max_zdb_data_dir_size: number;
    @Expose() @Type(() => Encryption) @ValidateNested() encryption: Encryption;
    @Expose() @Type(() => QuantumSafeMeta) @ValidateNested() meta: QuantumSafeMeta;
    @Expose() @Type(() => ZdbGroup) @ValidateNested({ each: true }) groups: ZdbGroup[];
    @Expose() @Type(() => QuantumCompression) @ValidateNested() compression: QuantumCompression;

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

class QuantumSafeFS extends WorkloadBaseData {
    @Expose() @IsInt() @Min(1024 * 1024 * 250) cache: number;
    @Expose() @Type(() => QuantumSafeFSConfig) @ValidateNested() config: QuantumSafeFSConfig;

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
