import * as PATH from "path";

import { MessageBusClientInterface } from "ts-rmb-client-base";
import { TFClient } from "./clients/tf-grid/client";

import { appPath } from "./helpers/jsonfs";
import * as modules from "./modules/index";

class GridClient {
    machines: modules.machines;
    zdbs: modules.zdbs;
    zos: modules.zos;
    qsfs_zdbs: modules.qsfs_zdbs;
    k8s: modules.k8s;
    contracts: modules.contracts;
    twins: modules.twins;
    gateway: modules.gateway;
    twinId: number;

    constructor(
        public url: string,
        public mnemonic: string,
        public rmbClient: MessageBusClientInterface,
        public projectName = "",
    ) {}
    async connect() {
        const tfclient = new TFClient(this.url, this.mnemonic);
        this.twinId = await tfclient.execute(tfclient.twins, tfclient.twins.getMyTwinId, []);
        this._connect();
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
            );
        }
    }
}

export { GridClient };
