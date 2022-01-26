#!/usr/bin/env node
import "reflect-metadata";

import fs from "fs";
import path from "path";
import { MessageBusServer } from "ts-rmb-redis-client";

import { GridClient } from "../client";
import { isExposed } from "../helpers/expose";
import { BackendStorageType } from "../storage/backend";
import { getRMBClient } from "./rmb_client";

const argv = process.argv.slice(2);
let config_file = path.join(__dirname, "./config.json");
argv.forEach((value, ind) => {
    if (value == "--config" || value == "-c") {
        config_file = argv[ind + 1];
    }
});
const config = JSON.parse(fs.readFileSync(config_file, "utf-8"));
class Server {
    server: MessageBusServer;
    constructor(port = 6379) {
        this.server = new MessageBusServer(port);
    }

    async wrapFunc(message, payload) {
        const rmbClient = getRMBClient(config);
        const gridClient = new GridClient(
            config.network,
            config.mnemonic,
            config.storeSecret,
            rmbClient,
            "",
            BackendStorageType.auto,
            config.keypairType,
        );
        await gridClient.connect();
        const parts = message.cmd.split(".");
        const module = parts[1];
        const method = parts[2];
        const obj = gridClient[module];
        console.log(`Executing Method: ${method} in Module: ${module} with Payload: ${payload}`);
        return await obj[method](JSON.parse(payload));
    }

    register() {
        const rmbClient = getRMBClient(config);
        const gridClient = new GridClient(
            config.network,
            config.mnemonic,
            config.storeSecret,
            rmbClient,
            "",
            BackendStorageType.auto,
            config.keypairType,
        );
        gridClient._connect();
        for (const module of Object.getOwnPropertyNames(gridClient).filter(
            item => typeof gridClient[item] === "object",
        )) {
            const props = Object.getPrototypeOf(gridClient[module]);
            const methods = Object.getOwnPropertyNames(props);
            for (const method of methods) {
                if (isExposed(gridClient[module], method) == true) {
                    this.server.withHandler(`twinserver.${module}.${method}`, this.wrapFunc);
                }
            }
        }
    }
    run() {
        this.server.run();
    }
}

if (!(config.network && config.mnemonic && config.storeSecret)) {
    throw new Error(`Invalid config. Please fill the config.json file with the correct data`);
}

const server = new Server();
server.register();
server.run();
