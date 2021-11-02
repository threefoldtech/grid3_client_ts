import "reflect-metadata";
import path from "path";
import { MessageBusServer } from "ts-rmb-redis-client";

import { GridClient } from "./client";
import { getRMBClient } from "./clients/rmb/client";
import { isExposed } from "./helpers/expose";
import { loadFromFile } from "./helpers/jsonfs";

const config = loadFromFile(path.join(__dirname, "../config.json"));
class Server {
    server: MessageBusServer;
    constructor(port = 6379) {
        this.server = new MessageBusServer(port);
    }

    async wrapFunc(message, payload) {
        const rmbClient = getRMBClient();
        const gridClient = new GridClient(config.url, config.mnemonic, rmbClient);
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
        const gridClient = new GridClient(config.url, config.mnemonic, rmbClient);
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

if (!(config.url && config.mnemonic)) {
    throw new Error(`Invalid config. Please fill the config.json file with correct data in repo home`);
}

const server = new Server();
server.register();
server.run();
