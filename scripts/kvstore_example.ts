import "reflect-metadata";

import fs from "fs";
import path from "path";

import { HTTPMessageBusClient } from "ts-rmb-http-client";
import { GridClient } from "../src/client";
import { BackendStorageType } from "../src/storage/backend";

/*
KVStore example usage:
*/
async function main() {
    //For creating grid3 client with KVStore, you need to specify the KVStore storage type in the pram:

    const config = JSON.parse(fs.readFileSync(path.join(__dirname, "./devnet_config.json"), "utf-8"));
    const rmb = new HTTPMessageBusClient(0, config.proxy);
    const gridClient = new GridClient(config.url, config.mnemonic, rmb, "", BackendStorageType.tfkvstore);
    await gridClient.connect();

    //then every module will use the KVStore to save its configuration and restore it.

    // also you can use it like this:
    const db = gridClient.kvstore;

    // set key
    const key = "my_config";
    await db.set({ key, value: JSON.stringify(config) });

    // list all the keys
    const keys = await db.list();
    console.log(keys);

    // get the key
    const data = await db.get({ key });
    console.log(JSON.parse(data.toString()));

    // // remove the key
    // await db.remove({ key });

    // disconnect
    await gridClient.disconnect();
}

main();
