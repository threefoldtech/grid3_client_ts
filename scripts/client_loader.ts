import fs from "fs";
import path from "path";
import { GridClient } from "../src/client";

import { MessageBusClientInterface } from "ts-rmb-client-base";
import { HTTPMessageBusClient } from "ts-rmb-http-client";
import { MessageBusClient } from "ts-rmb-redis-client";

const config = JSON.parse(fs.readFileSync(path.join(__dirname, "./testnet_config.json"), "utf-8"));

async function getClient(): Promise<GridClient> {
    let rmb: MessageBusClientInterface;
    if (config.proxy) {
        rmb = new HTTPMessageBusClient(0, config.proxy);
    } else {
        rmb = new MessageBusClient();
    }
    const gridClient = new GridClient(config.url, config.mnemonic, rmb);
    await gridClient.connect();
    return gridClient;
}

export { config, getClient };
