"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.appPath = exports.StorageUpdateAction = exports.BackendStorageType = exports.BackendStorage = void 0;
const appdata_path_1 = __importDefault(require("appdata-path"));
const PATH = __importStar(require("path"));
const tfkvstore_1 = require("./tfkvstore");
const appsPath = (0, appdata_path_1.default)();
const appPath = PATH.join(appsPath, "grid3_client");
exports.appPath = appPath;
var StorageUpdateAction;
(function (StorageUpdateAction) {
    StorageUpdateAction["add"] = "add";
    StorageUpdateAction["delete"] = "delete";
})(StorageUpdateAction || (StorageUpdateAction = {}));
exports.StorageUpdateAction = StorageUpdateAction;
var BackendStorageType;
(function (BackendStorageType) {
    BackendStorageType["auto"] = "auto";
    BackendStorageType["fs"] = "fs";
    BackendStorageType["localstorage"] = "localstorage";
    BackendStorageType["tfkvstore"] = "tfkvstore";
})(BackendStorageType || (BackendStorageType = {}));
exports.BackendStorageType = BackendStorageType;
class BackendStorage {
    type;
    storage;
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
            this.storage = new tfkvstore_1.TFKVStore(substrateURL, mnemonic, storeSecret, keypairType);
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
    async load(key) {
        const data = await this.storage.get(key);
        return JSON.parse(data.toString());
    }
    async list(key) {
        return await this.storage.list(key);
    }
    async dump(key, value) {
        return await this.storage.set(key, JSON.stringify(value));
    }
    async update(key, field, data = null, action = StorageUpdateAction.add) {
        let storedData = await this.load(key);
        if (!storedData) {
            storedData = {};
        }
        if (action === StorageUpdateAction.add) {
            storedData[field] = data;
        }
        else if (action === StorageUpdateAction.delete) {
            delete storedData[field];
        }
        await this.dump(key, storedData);
    }
}
exports.BackendStorage = BackendStorage;
