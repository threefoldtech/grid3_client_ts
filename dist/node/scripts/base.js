"use strict";
var __importDefault = (this && this.__importDefault) || function(mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getClient = exports.config = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const client_1 = require("../src/client");
const ts_rmb_http_client_1 = require("ts-rmb-http-client");
const ts_rmb_redis_client_1 = require("ts-rmb-redis-client");
const config = JSON.parse(fs_1.default.readFileSync(path_1.default.join(__dirname, "./devConfig.json"), "utf-8"));
exports.config = config;

function getClient() {
    let rmb;
    if (config.proxy) {
        rmb = new ts_rmb_http_client_1.HTTPMessageBusClient(config.twin_id, config.proxy);
    } else {
        rmb = new ts_rmb_redis_client_1.MessageBusClient();
    }
    return new client_1.GridClient(config.twin_id, config.url, config.mnemonic, rmb);
}
exports.getClient = getClient;