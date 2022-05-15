"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRMBClient = void 0;
const process_1 = require("process");
const ts_rmb_http_client_1 = require("ts-rmb-http-client");
const ts_rmb_redis_client_1 = require("ts-rmb-redis-client");
function getRmbProxy(config) {
    let isProxy = false;
    let rmbProxyUrl = "";
    // Check for rmb proxy url value from arguments
    process_1.argv.forEach((val, ind, arr) => {
        if (val == "--proxy" || val == "-p") {
            isProxy = true;
            rmbProxyUrl = arr[ind + 1] || "";
        }
    });
    if (isProxy) {
        return [isProxy, rmbProxyUrl];
    }
    // Check for rmb proxy value from config
    if (config && config.rmb_proxy) {
        rmbProxyUrl = typeof config.rmb_proxy === "boolean" ? "" : config.rmb_proxy;
        return [true, rmbProxyUrl];
    }
    // Check for rmb proxy value from env
    if (process_1.env.RMB_PROXY) {
        return [true, process_1.env.RMB_PROXY];
    }
    return [false, ""];
}
// MsgBusClientInterface
function getRMBClient(config) {
    const [isProxy, rmb_proxy] = getRmbProxy(config);
    if (isProxy) {
        return new ts_rmb_http_client_1.HTTPMessageBusClient(0, rmb_proxy, "", "");
    }
    else {
        return new ts_rmb_redis_client_1.MessageBusClient();
    }
}
exports.getRMBClient = getRMBClient;
