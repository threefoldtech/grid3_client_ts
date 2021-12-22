import getAppDataPath from "appdata-path";
import { Expose, Type } from "class-transformer";
import { IsEnum, IsOptional, IsString, ValidateNested } from "class-validator";
import * as PATH from "path";

import { KeypairType } from "../clients/tf-grid/client";
import { log } from "../helpers/utils";
import BackendInterface from "./BackendInterface";
import { TFKVStore } from "./tfkvstore";

const appsPath = getAppDataPath();
const appPath = PATH.join(appsPath, "grid3_client");

enum StorageUpdateAction {
    add = "add",
    delete = "delete",
}

enum BackendStorageType {
    auto = "auto",
    fs = "fs",
    localstorage = "localstorage",
    tfkvstore = "tfkvstore",
}

class BackendStorageOptions {
    @Expose() @IsString() @IsOptional() substrateURL?: string;
    @Expose() @IsString() @IsOptional() mnemonic?: string;
    @Expose() @Type(() => String || Uint8Array) @IsOptional() storeSecret?: string | Uint8Array;
    @Expose() @IsEnum(KeypairType) @IsOptional() keypairType?: KeypairType = KeypairType.sr25519;
}

class BackendStorage {
    constructor(
        public backend?: BackendInterface,
        public type: BackendStorageType = BackendStorageType.auto,
        public options: BackendStorageOptions = {},
    ) {
        // Return if backend storage instance sent as parameter
        if (this.backend) return;

        // Assign backend storage instance based on type and options
        if (type === BackendStorageType.auto) {
            if (BackendStorage.isEnvNode()) {
                const storage = require("./filesystem");
                this.backend = new storage.FS();
            } else {
                const storage = require("./localstorage");
                this.backend = new storage.LocalStorage();
            }
        } else if (type === BackendStorageType.tfkvstore) {
            this.backend = new TFKVStore(
                options.substrateURL,
                options.mnemonic,
                options.storeSecret,
                options.keypairType,
            );
        } else if (type === BackendStorageType.fs) {
            const storage = require("./filesystem");
            this.backend = new storage.FS();
        } else if (type === BackendStorageType.localstorage) {
            const storage = require("./localstorage");
            this.backend = new storage.LocalStorage();
        } else {
            throw Error("Unsupported type for backend");
        }
    }

    static isEnvNode(): boolean {
        return (
            typeof process === "object" &&
            typeof process.versions === "object" &&
            typeof process.versions.node !== "undefined"
        );
    }

    async load(key: string) {
        const data = await this.backend.get(key);
        return JSON.parse(data.toString());
    }

    async list(key: string) {
        return await this.backend.list(key);
    }

    async dump(key: string, value) {
        return await this.backend.set(key, JSON.stringify(value));
    }

    async update(key: string, field: string, data = null, action: StorageUpdateAction = StorageUpdateAction.add) {
        const storedData = await this.load(key);
        if (action === StorageUpdateAction.add) {
            storedData[field] = data;
        } else if (action === StorageUpdateAction.delete) {
            delete storedData[field];
        }
        await this.dump(key, storedData);
    }
}

export { BackendStorage, BackendStorageType, StorageUpdateAction, appPath };
