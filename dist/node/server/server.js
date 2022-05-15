#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const ts_rmb_redis_client_1 = require("ts-rmb-redis-client");
const client_1 = require("../client");
const expose_1 = require("../helpers/expose");
const backend_1 = require("../storage/backend");
const rmb_client_1 = require("./rmb_client");
const argv = process.argv.slice(2);
let config_file = path_1.default.join(__dirname, "./config.json");
argv.forEach((value, ind) => {
    if (value == "--config" || value == "-c") {
        config_file = argv[ind + 1];
    }
});
const config = JSON.parse(fs_1.default.readFileSync(config_file, "utf-8"));
class Server {
    server;
    constructor(port = 6379) {
        this.server = new ts_rmb_redis_client_1.MessageBusServer(port);
    }
    async wrapFunc(message, payload) {
        const rmbClient = (0, rmb_client_1.getRMBClient)(config);
        const gridClient = new client_1.GridClient(config.network, config.mnemonic, config.storeSecret, rmbClient, "", backend_1.BackendStorageType.auto, config.keypairType);
        await gridClient.connect();
        const parts = message.cmd.split(".");
        const module = parts[1];
        const method = parts[2];
        const obj = gridClient[module];
        console.log(`Executing Method: ${method} in Module: ${module} with Payload: ${payload}`);
        return await obj[method](JSON.parse(payload));
    }
    register() {
        const rmbClient = (0, rmb_client_1.getRMBClient)(config);
        const gridClient = new client_1.GridClient(config.network, config.mnemonic, config.storeSecret, rmbClient, "", backend_1.BackendStorageType.auto, config.keypairType);
        gridClient._connect();
        for (const module of Object.getOwnPropertyNames(gridClient).filter(item => typeof gridClient[item] === "object")) {
            const props = Object.getPrototypeOf(gridClient[module]);
            const methods = Object.getOwnPropertyNames(props);
            for (const method of methods) {
                if ((0, expose_1.isExposed)(gridClient[module], method) == true) {
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
