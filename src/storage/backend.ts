import * as PATH from "path";
import getAppDataPath from "appdata-path";
import { TFKVStore } from "./tfkvstore";

const appsPath = getAppDataPath();
const appPath = PATH.join(appsPath, "grid3_client");

enum StorageUpdateAction {
    add = "add",
    delete = "delete",
}

enum BackendStorageType {
    default = "default",
    tfkvstore = "tfkvstore",
}

class BackendStorage {
    storage;
    constructor(public type: BackendStorageType = BackendStorageType.default, url = "", mnemonic = "") {
        if (type === BackendStorageType.default) {
            if (BackendStorage.isEnvNode) {
                const storage = require("./filesystem");
                this.storage = new storage.FS();
            } else {
                const storage = require("./localstorage");
                this.storage = new storage.LocalStorage();
            }
        } else if (type === BackendStorageType.tfkvstore) {
            this.storage = new TFKVStore(url, mnemonic);
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
        const data = await this.storage.get(key);
        return JSON.parse(data.toString());
    }

    async dump(key: string, value) {
        return await this.storage.set(key, JSON.stringify(value));
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
