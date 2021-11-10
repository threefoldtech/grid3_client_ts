import fs from "fs";
import path from "path";
import { GridClient } from "../src/client";

import { MessageBusClientInterface } from "ts-rmb-client-base";
import { HTTPMessageBusClient } from "ts-rmb-http-client";
import { MessageBusClient } from "ts-rmb-redis-client";
import { BackendStorageType } from "../src/storage/backend";
import { KeypairType } from "../src/clients/tf-grid/client";

const config = JSON.parse(fs.readFileSync(path.join(__dirname, "./config.json"), "utf-8"));

async function getClient(): Promise<GridClient> {
    let rmb: MessageBusClientInterface;
    if (config.rmb_proxy) {
        rmb = new HTTPMessageBusClient(0, "");
    } else {
        rmb = new MessageBusClient();
    }
    const gridClient = new GridClient(config.network, config.mnemonic, rmb, "", BackendStorageType.auto, KeypairType.ed25519);
    await gridClient.connect();
    return gridClient;
}

export { config, getClient };
