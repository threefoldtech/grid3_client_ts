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
Object.defineProperty(exports, "__esModule", { value: true });
exports.GridClient = void 0;
const PATH = __importStar(require("path"));
const machine_1 = require("./modules/machine");
const k8s_1 = require("./modules/k8s");
const zdb_1 = require("./modules/zdb");
const gateway_1 = require("./modules/gateway");
const qsfs_zdbs_1 = require("./modules/qsfs_zdbs");
const jsonfs_1 = require("./helpers/jsonfs");
class GridClient {
    twin_id;
    url;
    mnemonic;
    rmbClient;
    machines;
    k8s;
    zdbs;
    gateway;
    qsfs_zdbs;
    constructor(twin_id, url, mnemonic, rmbClient, projectName = "") {
        this.twin_id = twin_id;
        this.url = url;
        this.mnemonic = mnemonic;
        this.rmbClient = rmbClient;
        let env = "mainnet";
        if (this.url.includes("dev")) {
            env = "devnet";
        }
        else if (this.url.includes("test")) {
            env = "testnet";
        }
        const storePath = PATH.join(jsonfs_1.appPath, env);
        this.machines = new machine_1.MachineModule(twin_id, url, mnemonic, rmbClient, storePath, projectName);
        this.k8s = new k8s_1.K8sModule(twin_id, url, mnemonic, rmbClient, storePath, projectName);
        this.zdbs = new zdb_1.ZdbsModule(twin_id, url, mnemonic, rmbClient, storePath, projectName);
        this.gateway = new gateway_1.GWModule(twin_id, url, mnemonic, rmbClient, storePath, projectName);
        this.qsfs_zdbs = new qsfs_zdbs_1.QSFSZdbsModule(twin_id, url, mnemonic, rmbClient, storePath, projectName);
    }
}
exports.GridClient = GridClient;
