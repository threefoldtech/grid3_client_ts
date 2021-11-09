import * as PATH from "path";

import { MessageBusClientInterface } from "ts-rmb-client-base";
import { KeypairType, TFClient } from "./clients/tf-grid/client";

import { appPath } from "./storage/backend";
import * as modules from "./modules/index";
import { BackendStorageType, BackendStorage } from "./storage/backend";

enum NetworkEnv {
    dev = "dev",
    test = "test",
}

class GridClientConfig {
    network: NetworkEnv;
    mnemonic: string;
    rmbClient: MessageBusClientInterface;
    projectName: string;
    storageBackendType: BackendStorageType;
    keypairType: KeypairType;
    storePath: string;
    graphqlURL: string;
    substrateURL: string;
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
    twinId: number;

    constructor(
        public network: NetworkEnv,
        public mnemonic: string,
        public rmbClient: MessageBusClientInterface,
        public projectName = "",
        public storageBackendType: BackendStorageType = BackendStorageType.default,
        public keypairType: KeypairType = KeypairType.sr25519,
    ) {}
    async connect() {
        const urls = this.getDefaultUrls(this.network);
        const tfclient = new TFClient(urls.substrate, this.mnemonic, this.keypairType);
        await tfclient.connect();
        this.twinId = await tfclient.twins.getMyTwinId();
        this._connect();
        if (BackendStorage.isEnvNode) {
            process.on("SIGINT", this.disconnect);
            process.on("SIGUSR1", this.disconnect);
            process.on("SIGUSR2", this.disconnect);
            process.on("uncaughtException", this.disconnect);
        } else window.onbeforeunload = this.disconnect;
    }
    _connect() {
        const urls = this.getDefaultUrls(this.network);
        this.rmbClient["twinId"] = this.twinId;
        this.rmbClient["proxyURL"] = urls.rmbProxy;
        const storePath = PATH.join(appPath, this.network, String(this.twinId));
        for (const module of Object.getOwnPropertyNames(modules).filter(item => typeof modules[item] === "function")) {
            if (module.includes("Model")) {
                continue;
            }
            this[module] = new modules[module](
                this.twinId,
                urls.substrate,
                this.mnemonic,
                this.rmbClient,
                storePath,
                this.projectName,
                this.storageBackendType,
            );
        }
        GridClient.config = {
            network: this.network,
            mnemonic: this.mnemonic,
            rmbClient: this.rmbClient,
            projectName: this.projectName,
            storageBackendType: this.storageBackendType,
            keypairType: this.keypairType,
            storePath: storePath,
            graphqlURL: urls.graphql,
            substrateURL: urls.substrate,
        };
    }

    getDefaultUrls(network: NetworkEnv) {
        const urls = { rmbProxy: "", substrate: "", graphql: "" };
        if (network === NetworkEnv.dev) {
            urls.rmbProxy = "https://gridproxy.dev.grid.tf/";
            urls.substrate = "wss://tfchain.dev.threefold.io/ws";
            urls.graphql = "https://graphql.test.grid.tf/graphql";
        }
        else if (network === NetworkEnv.test) {
            urls.rmbProxy = "https://gridproxy.test.grid.tf/";
            urls.substrate = "wss://tfchain.test.threefold.io/ws";
            urls.graphql = "https://graphql.test.grid.tf/graphql";
        }
        return urls;
    }

    disconnect() {
        console.log("disconnecting");
        for (const key of Object.keys(TFClient.clients)) {
            TFClient.clients[key].disconnect();
        }
    }
}

export { GridClient };
