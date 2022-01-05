import { argv, env } from "process";
import { MessageBusClientInterface } from "ts-rmb-client-base";
import { HTTPMessageBusClient } from "ts-rmb-http-client";
import { MessageBusClient } from "ts-rmb-redis-client";

function getRmbProxy(config?: any): [boolean, string] {
    let isProxy = false;
    let rmbProxyUrl = "";
    // Check for rmb proxy url value from arguments
    argv.forEach((val, ind, arr) => {
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
    if (env.RMB_PROXY) {
        return [true, env.RMB_PROXY];
    }
    return [false, ""];
}

// MsgBusClientInterface
function getRMBClient(config?: any): MessageBusClientInterface {
    const [isProxy, rmb_proxy] = getRmbProxy(config);
    if (isProxy) {
        return new HTTPMessageBusClient(0, rmb_proxy);
    } else {
        return new MessageBusClient();
    }
}

export { getRMBClient };
