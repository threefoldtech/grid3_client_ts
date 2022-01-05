import fs from "fs";
import path from "path";
import { env } from "process";
import { MessageBusClientInterface } from "ts-rmb-client-base";
import { HTTPMessageBusClient } from "ts-rmb-http-client";
import { MessageBusClient } from "ts-rmb-redis-client";

import { ClientOptions, GridClient } from "../src/client";

const network = env.NETWORK;
const mnemonic = env.MNEMONIC;
const rmb_proxy = env.RMB_PROXY;
const storeSecret = env.STORE_SECRET;
const ssh_key = env.SSH_KEY;
let config;

if (
    network === undefined ||
    mnemonic === undefined ||
    rmb_proxy === undefined ||
    storeSecret === undefined ||
    ssh_key === undefined
) {
    console.log("Credentials not all found in env variables. Loading all credentials from default config.json...");
    config = JSON.parse(fs.readFileSync(path.join(__dirname, "./config.json"), "utf-8"));
} else {
    console.log("Credentials loaded from env variables...");
    config = {
        network: network,
        mnemonic: mnemonic,
        rmb_proxy: rmb_proxy,
        storeSecret: storeSecret,
        ssh_key: ssh_key,
    };
}

async function getClient(): Promise<GridClient> {
    let rmbClient: MessageBusClientInterface;
    if (config.rmb_proxy) {
        rmbClient = new HTTPMessageBusClient(0, "");
    } else {
        rmbClient = new MessageBusClient();
    }

    const gridClient = new GridClient({
        network: config.network,
        mnemonic: config.mnemonic,
        storeSecret: config.storeSecret,
        rmbClient,
    } as ClientOptions);
    await gridClient.connect();
    return gridClient;
}

export { config, getClient };
