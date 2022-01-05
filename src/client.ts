import * as PATH from "path";
import { MessageBusClientInterface } from "ts-rmb-client-base";

import { KeypairType, TFClient } from "./clients/tf-grid/client";
import { GridClientConfig, NetworkEnv } from "./config";
import * as modules from "./modules/index";
import { appPath } from "./storage/backend";
import { BackendStorage, BackendStorageType } from "./storage/backend";
import BackendInterface from "./storage/BackendInterface";

class ClientOptions {
    constructor(
        public network: NetworkEnv,
        public mnemonic: string,
        public storeSecret: string | Uint8Array,
        public rmbClient: MessageBusClientInterface,
        public projectName: string = "",
        public backendStorage: BackendInterface = null,
        public backendStorageType: BackendStorageType = BackendStorageType.auto,
        public keypairType: KeypairType = KeypairType.sr25519,
    ) {}
}

class GridClient {
    static config: GridClientConfig;
    machines: modules.machines;
    k8s: modules.k8s;
    zdbs: modules.zdbs;
    gateway: modules.gateway;
    qsfs_zdbs: modules.qsfs_zdbs;
    zos: modules.zos;
    contracts: modules.contracts;
    twins: modules.twins;
    kvstore: modules.kvstore;
    balance: modules.balance;
    capacity: modules.capacity;
    twinId: number;

    constructor(public options: ClientOptions) {}
    async connect() {
        const urls = this.getDefaultUrls(this.options.network);
        const tfclient = new TFClient(
            urls.substrate,
            this.options.mnemonic,
            this.options.storeSecret,
            this.options.keypairType,
        );
        await tfclient.connect();
        if (BackendStorage.isEnvNode()) {
            process.on("exit", this.disconnect);
            process.on("SIGINT", this.disconnect);
            process.on("SIGUSR1", this.disconnect);
            process.on("SIGUSR2", this.disconnect);
        } else window.onbeforeunload = this.disconnect;
        this.twinId = await tfclient.twins.getMyTwinId();
        this._connect();
    }
    _connect(): void {
        const urls = this.getDefaultUrls(this.options.network);
        this.options.rmbClient["twinId"] = this.twinId;
        this.options.rmbClient["proxyURL"] = urls.rmbProxy;
        const storePath = PATH.join(appPath, this.options.network, String(this.twinId));
        GridClient.config = {
            network: this.options.network,
            mnemonic: this.options.mnemonic,
            storeSecret: this.options.storeSecret,
            rmbClient: this.options.rmbClient,
            projectName: this.options.projectName,
            backendStorage: this.options.backendStorage,
            backendStorageType: this.options.backendStorageType,
            keypairType: this.options.keypairType,
            storePath: storePath,
            graphqlURL: urls.graphql,
            substrateURL: urls.substrate,
            twinId: this.twinId,
        };
        for (const module of Object.getOwnPropertyNames(modules).filter(item => typeof modules[item] === "function")) {
            if (module.includes("Model")) {
                continue;
            }
            this[module] = new modules[module](GridClient.config);
        }
    }

    getDefaultUrls(network: NetworkEnv): Record<string, string> {
        const urls = { rmbProxy: "", substrate: "", graphql: "" };
        if (network === NetworkEnv.dev) {
            urls.rmbProxy = "https://gridproxy.dev.grid.tf";
            urls.substrate = "wss://tfchain.dev.grid.tf/ws";
            urls.graphql = "https://graphql.dev.grid.tf/graphql";
        } else if (network === NetworkEnv.test) {
            urls.rmbProxy = "https://gridproxy.test.grid.tf";
            urls.substrate = "wss://tfchain.test.grid.tf/ws";
            urls.graphql = "https://graphql.test.grid.tf/graphql";
        }
        return urls;
    }

    disconnect(): void {
        for (const key of Object.keys(TFClient.clients)) {
            TFClient.clients[key].disconnect();
        }
    }
}

export { GridClient, ClientOptions };
