import { IsString, IsNotEmpty, IsBoolean, IsDefined, IsInt, Min, ValidateNested } from "class-validator";

class Encryption {
    @IsNotEmpty() @IsString() algorithm: string;
    @IsNotEmpty() @IsString() key: string;

    challenge() {
        let out = "";
        out += this.algorithm;
        out += this.key;
        return out;
    }
}

class ZdbBackend {
    @IsNotEmpty() @IsString() address: string;
    @IsNotEmpty() @IsString() namespace: string;
    @IsNotEmpty() @IsString() password: string;

    challenge() {
        let out = "";
        out += this.address;
        out += this.namespace;
        out += this.password;
        return out;
    }
}

class QuantumSafeConfig {
    @IsNotEmpty() @IsString() prefix: string;
    @ValidateNested() encryption: Encryption;
    @ValidateNested({ each: true }) backends: ZdbBackend[];

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
    @IsNotEmpty() @IsString() type: string;
    @ValidateNested() config: QuantumSafeConfig;

    challenge() {
        let out = "";
        out += this.type;
        out += this.config.challenge();
        return out;
    }
}

class ZdbGroup {
    @ValidateNested({ each: true }) backends: ZdbBackend[];
    challenge() {
        let out = "";
        for (const backend of this.backends) {
            out += backend.challenge();
        }
        return out;
    }
}

class QuantumCompression {
    @IsNotEmpty() @IsString() algorithm: string;
    challenge() {
        return this.algorithm;
    }
}

class QuantumSafeFSConfig {
    @IsInt() @Min(2) minimal_shards: number;
    @IsInt() @Min(1) expected_shards: number;
    @IsInt() @Min(1) redundant_groups: number;
    @IsInt() @Min(1) redundant_nodes: number;
    @IsInt() @Min(1) max_zdb_data_dir_size: number;
    @ValidateNested() encryption: Encryption;
    @ValidateNested() meta: QuantumSafeMeta;
    @ValidateNested({ each: true }) groups: ZdbGroup[];
    @ValidateNested() compression: QuantumCompression;

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
    @IsInt() @Min(1024 * 1024 * 250) cache: number;
    @ValidateNested() config: QuantumSafeFSConfig;
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
