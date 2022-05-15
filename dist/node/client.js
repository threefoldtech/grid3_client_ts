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
const client_1 = require("./clients/tf-grid/client");
const config_1 = require("./config");
const modules = __importStar(require("./modules/index"));
const backend_1 = require("./storage/backend");
const backend_2 = require("./storage/backend");
class GridClient {
    network;
    mnemonic;
    storeSecret;
    rmbClient;
    projectName;
    backendStorageType;
    keypairType;
    signer;
    static config;
    machines;
    k8s;
    zdbs;
    gateway;
    qsfs_zdbs;
    zos;
    contracts;
    twins;
    kvstore;
    balance;
    capacity;
    twinId;
    nodes;
    constructor(network, mnemonic, storeSecret, rmbClient, projectName = "", backendStorageType = backend_2.BackendStorageType.auto, keypairType = client_1.KeypairType.sr25519, signer = null) {
        this.network = network;
        this.mnemonic = mnemonic;
        this.storeSecret = storeSecret;
        this.rmbClient = rmbClient;
        this.projectName = projectName;
        this.backendStorageType = backendStorageType;
        this.keypairType = keypairType;
        this.signer = signer;
    }
    async connect() {
        const urls = this.getDefaultUrls(this.network);
        const tfclient = new client_1.TFClient(urls.substrate, this.mnemonic, this.storeSecret, this.keypairType, this.signer);
        await tfclient.connect();
        if (backend_2.BackendStorage.isEnvNode()) {
            process.on("SIGTERM", this.disconnectAndExit);
            process.on("SIGINT", this.disconnectAndExit);
            process.on("SIGUSR1", this.disconnectAndExit);
            process.on("SIGUSR2", this.disconnectAndExit);
        }
        else {
            window.onbeforeunload = () => {
                return "";
            };
            window.onunload = this.disconnect;
        }
        try {
            this.twinId = await tfclient.twins.getMyTwinId();
        }
        catch (e) {
            console.log(e);
            throw Error(`Couldn't find a user for the provided mnemonic on ${this.network} network.`);
        }
        this._connect();
    }
    _connect() {
        const urls = this.getDefaultUrls(this.network);
        this.rmbClient["twinId"] = this.twinId;
        this.rmbClient["proxyURL"] = urls.rmbProxy;
        this.rmbClient["graphqlURL"] = urls.graphql;
        this.rmbClient["mnemonic"] = this.mnemonic;
        this.rmbClient["keypairType"] = this.keypairType;
        this.rmbClient["verifyResponse"] = true;
        const storePath = PATH.join(backend_1.appPath, this.network, String(this.twinId));
        GridClient.config = {
            network: this.network,
            mnemonic: this.mnemonic,
            storeSecret: this.storeSecret,
            rmbClient: this.rmbClient,
            projectName: this.projectName,
            backendStorageType: this.backendStorageType,
            keypairType: this.keypairType,
            storePath: storePath,
            graphqlURL: urls.graphql,
            substrateURL: urls.substrate,
            twinId: this.twinId,
            signer: this.signer,
        };
        for (const module of Object.getOwnPropertyNames(modules).filter(item => typeof modules[item] === "function")) {
            if (module.includes("Model")) {
                continue;
            }
            this[module] = new modules[module](GridClient.config);
        }
    }
    getDefaultUrls(network) {
        const urls = { rmbProxy: "", substrate: "", graphql: "" };
        if (network === config_1.NetworkEnv.dev) {
            urls.rmbProxy = "https://gridproxy.dev.grid.tf";
            urls.substrate = "wss://tfchain.dev.grid.tf/ws";
            urls.graphql = "https://graphql.dev.grid.tf/graphql";
        }
        else if (network === config_1.NetworkEnv.test) {
            urls.rmbProxy = "https://gridproxy.test.grid.tf";
            urls.substrate = "wss://tfchain.test.grid.tf/ws";
            urls.graphql = "https://graphql.test.grid.tf/graphql";
        }
        else if (network === config_1.NetworkEnv.main) {
            urls.rmbProxy = "https://gridproxy.grid.tf";
            urls.substrate = "wss://tfchain.grid.tf/ws";
            urls.graphql = "https://graph.grid.tf/graphql";
        }
        return urls;
    }
    async disconnect() {
        for (const key of Object.keys(client_1.TFClient.clients)) {
            await client_1.TFClient.clients[key].disconnect();
        }
    }
    async disconnectAndExit() {
        // this should be only used by nodejs process
        for (const key of Object.keys(client_1.TFClient.clients)) {
            await client_1.TFClient.clients[key].disconnect();
        }
        process.exit(0);
    }
}
exports.GridClient = GridClient;
