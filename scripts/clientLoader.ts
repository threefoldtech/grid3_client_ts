import fs from "fs";
import path from "path";
import { GridClient } from "../src/client";

import { MessageBusClientInterface } from "ts-rmb-client-base";
import { HTTPMessageBusClient } from "ts-rmb-http-client";
import { MessageBusClient } from "ts-rmb-redis-client";

const config = JSON.parse(fs.readFileSync(path.join(__dirname, "./devnetConfig.json"), "utf-8"));

function getClient(): GridClient {
    let rmb: MessageBusClientInterface;
    if (config.proxy) {
        rmb = new HTTPMessageBusClient(config.twin_id, config.proxy);
    } else {
        rmb = new MessageBusClient();
    }
    return new GridClient(config.twin_id, config.url, config.mnemonic, rmb);
}

export { config, getClient };
