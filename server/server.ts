import "reflect-metadata";
import path from "path";
import fs from "fs";
import { MessageBusServer } from "ts-rmb-redis-client";

import { GridClient } from "../src/client";
import { getRMBClient } from "./rmb_client";
import { isExposed } from "../src/helpers/expose";

const config = JSON.parse(fs.readFileSync(path.join(__dirname, "./config.json"), "utf-8"));
class Server {
    server: MessageBusServer;
    constructor(port = 6379) {
        this.server = new MessageBusServer(port);
    }

    async wrapFunc(message, payload) {
        const rmbClient = getRMBClient();
        const gridClient = new GridClient(config.network, config.mnemonic, rmbClient);
        await gridClient.connect();
        const parts = message.cmd.split(".");
        const module = parts[1];
        const method = parts[2];
        const obj = gridClient[module];
        console.log(`Executing Method: ${method} in Module: ${module} with Payload: ${payload}`);
        return await obj[method](JSON.parse(payload));
    }

    register() {
        const rmbClient = getRMBClient();
        const gridClient = new GridClient(config.network, config.mnemonic, rmbClient);
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

if (!(config.network && config.mnemonic)) {
    throw new Error(`Invalid config. Please fill the config.json file with correct data`);
}

const server = new Server();
server.register();
server.run();
