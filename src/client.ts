import * as PATH from "path";

import { MessageBusClientInterface } from "ts-rmb-client-base";
import { TFClient } from "./clients/tf-grid/client";

import { appPath } from "./storage/backend";
import * as modules from "./modules/index";
import { BackendStorageType, BackendStorage } from "./storage/backend";

class GridClient {
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
        public url: string,
        public mnemonic: string,
        public rmbClient: MessageBusClientInterface,
        public projectName = "",
        public storageBackendType = BackendStorageType.default,
    ) {}
    async connect() {
        const tfclient = new TFClient(this.url, this.mnemonic);
        await tfclient.connect();
        this.twinId = await tfclient.twins.getMyTwinId();
        this._connect();
        if (BackendStorage.isEnvNode) {
            process.on('SIGINT', this.disconnect);
            process.on('SIGUSR1', this.disconnect);
            process.on('SIGUSR2', this.disconnect);
            process.on('uncaughtException', this.disconnect);
        }
        else
            window.onbeforeunload = this.disconnect;
    }
    _connect() {
        let env = "mainnet";
        if (this.url.includes("dev")) {
            env = "devnet";
        } else if (this.url.includes("test")) {
            env = "testnet";
        }

        this.rmbClient["twinId"] = this.twinId;
        const storePath = PATH.join(appPath, env, String(this.twinId));
        for (const module of Object.getOwnPropertyNames(modules).filter(item => typeof modules[item] === "function")) {
            if (module.includes("Model")) {
                continue;
            }
            this[module] = new modules[module](
                this.twinId,
                this.url,
                this.mnemonic,
                this.rmbClient,
                storePath,
                this.projectName,
                this.storageBackendType,
            );
        }
    }

    disconnect() {
        console.log("disconnecting");
        for (const key of Object.keys(TFClient.clients)) {
            TFClient.clients[key].disconnect();
        }
    }
}

export { GridClient };
