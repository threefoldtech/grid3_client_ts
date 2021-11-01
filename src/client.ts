import * as PATH from "path";

import { MessageBusClientInterface } from "ts-rmb-client-base";

import { appPath } from "./helpers/jsonfs";
import * as modules from "./modules/index";

import { machines } from "./modules/machine";
import { zdb } from "./modules/zdb";
import { zos } from "./modules/zos";
import { qsfs_zdbs } from "./modules/qsfs_zdbs";
import { k8s } from "./modules/k8s";
import { contracts } from "./modules/contracts";
import { twins } from "./modules/twins";
import { gateway } from "./modules/gateway";

class GridClient {
    machines: machines;
    zdb: zdb;
    zos: zos;
    qsfs_zdbs: qsfs_zdbs;
    k8s: k8s;
    contracts: contracts;
    twins: twins;
    gateway: gateway;

    constructor(
        public twin_id: number,
        public url: string,
        public mnemonic: string,
        public rmbClient: MessageBusClientInterface,
        projectName = "",
    ) {
        let env = "mainnet";
        if (this.url.includes("dev")) {
            env = "devnet";
        } else if (this.url.includes("test")) {
            env = "testnet";
        }
        const storePath = PATH.join(appPath, String(twin_id), env);

        for (const module of Object.getOwnPropertyNames(modules).filter(item => typeof modules[item] === "function")) {
            if (module.includes("Model")) {
                continue;
            }
            this[module] = new modules[module](twin_id, url, mnemonic, rmbClient, storePath, projectName);
        }
    }
}

export { GridClient };
