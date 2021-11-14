import * as PATH from "path";
import { MessageBusClientInterface } from "ts-rmb-client-base";

import { KeypairType, TFClient } from "./clients/tf-grid/client";
import { GridClientConfig, NetworkEnv } from "./config";
import * as modules from "./modules/index";
import { appPath } from "./storage/backend";
import { BackendStorage, BackendStorageType } from "./storage/backend";

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
    nodes: modules.nodes;

    constructor(
        public network: NetworkEnv,
        public mnemonic: string,
        public storeSecret: string | Uint8Array,
        public rmbClient: MessageBusClientInterface,
        public projectName: string = "",
        public backendStorageType: BackendStorageType = BackendStorageType.auto,
        public keypairType: KeypairType = KeypairType.sr25519,
        public signer = null,
    ) {}
    async connect(): Promise<void> {
        const urls = this.getDefaultUrls(this.network);
        const tfclient = new TFClient(urls.substrate, this.mnemonic, this.storeSecret, this.keypairType, this.signer);
        await tfclient.connect();
        if (BackendStorage.isEnvNode()) {
            process.on("SIGTERM", this.disconnectAndExit);
            process.on("SIGINT", this.disconnectAndExit);
            process.on("SIGUSR1", this.disconnectAndExit);
            process.on("SIGUSR2", this.disconnectAndExit);
        } else {
            window.onbeforeunload = () => {
                return "";
            };
            window.onunload = this.disconnect;
        }
        try {
            this.twinId = await tfclient.twins.getMyTwinId();
        } catch (e) {
            console.log(e);
            throw Error(`Couldn't find a user for the provided mnemonic on ${this.network} network.`);
        }
        this._connect();
    }
    _connect(): void {
        const urls = this.getDefaultUrls(this.network);
        this.rmbClient["twinId"] = this.twinId;
        this.rmbClient["proxyURL"] = urls.rmbProxy;
        this.rmbClient["graphqlURL"] = urls.graphql;
        this.rmbClient["mnemonic"] = this.mnemonic;
        this.rmbClient["keypairType"] = this.keypairType;
        this.rmbClient["verifyResponse"] = true;
        const storePath = PATH.join(appPath, this.network, String(this.twinId));
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
        } else if (network === NetworkEnv.main) {
            urls.rmbProxy = "https://gridproxy.grid.tf";
            urls.substrate = "wss://tfchain.grid.tf/ws";
            urls.graphql = "https://graph.grid.tf/graphql";
        }
        return urls;
    }

    async disconnect(): Promise<void> {
        for (const key of Object.keys(TFClient.clients)) {
            await TFClient.clients[key].disconnect();
        }
    }

    async disconnectAndExit(): Promise<void> {
        // this should be only used by nodejs process
        for (const key of Object.keys(TFClient.clients)) {
            await TFClient.clients[key].disconnect();
        }
        process.exit(0);
    }
}

export { GridClient };
