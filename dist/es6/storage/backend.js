var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import getAppDataPath from "appdata-path";
import * as PATH from "path";
import { TFKVStore } from "./tfkvstore";
const appsPath = getAppDataPath();
const appPath = PATH.join(appsPath, "grid3_client");
var StorageUpdateAction;
(function (StorageUpdateAction) {
    StorageUpdateAction["add"] = "add";
    StorageUpdateAction["delete"] = "delete";
})(StorageUpdateAction || (StorageUpdateAction = {}));
var BackendStorageType;
(function (BackendStorageType) {
    BackendStorageType["auto"] = "auto";
    BackendStorageType["fs"] = "fs";
    BackendStorageType["localstorage"] = "localstorage";
    BackendStorageType["tfkvstore"] = "tfkvstore";
})(BackendStorageType || (BackendStorageType = {}));
class BackendStorage {
    constructor(type = BackendStorageType.auto, substrateURL = "", mnemonic = "", storeSecret, keypairType) {
        this.type = type;
        if (type === BackendStorageType.auto) {
            if (BackendStorage.isEnvNode()) {
                const storage = require("./filesystem");
                this.storage = new storage.FS();
            }
            else {
                const storage = require("./localstorage");
                this.storage = new storage.LocalStorage();
            }
        }
        else if (type === BackendStorageType.tfkvstore) {
            this.storage = new TFKVStore(substrateURL, mnemonic, storeSecret, keypairType);
        }
        else if (type === BackendStorageType.fs) {
            const storage = require("./filesystem");
            this.storage = new storage.FS();
        }
        else if (type === BackendStorageType.localstorage) {
            const storage = require("./localstorage");
            this.storage = new storage.LocalStorage();
        }
        else {
            throw Error("Unsupported type for backend");
        }
    }
    static isEnvNode() {
        return (typeof process === "object" &&
            typeof process.versions === "object" &&
            typeof process.versions.node !== "undefined");
    }
    load(key) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.storage.get(key);
            return JSON.parse(data.toString());
        });
    }
    list(key) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.storage.list(key);
        });
    }
    dump(key, value) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.storage.set(key, JSON.stringify(value));
        });
    }
    update(key, field, data = null, action = StorageUpdateAction.add) {
        return __awaiter(this, void 0, void 0, function* () {
            let storedData = yield this.load(key);
            if (!storedData) {
                storedData = {};
            }
            if (action === StorageUpdateAction.add) {
                storedData[field] = data;
            }
            else if (action === StorageUpdateAction.delete) {
                delete storedData[field];
            }
            yield this.dump(key, storedData);
        });
    }
}
export { BackendStorage, BackendStorageType, StorageUpdateAction, appPath };
