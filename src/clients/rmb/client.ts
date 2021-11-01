import { MessageBusClientInterface } from "ts-rmb-client-base";
import { MessageBusClient } from "ts-rmb-redis-client";
import { HTTPMessageBusClient } from "ts-rmb-http-client";
import { argv, env } from "process";

import { loadFromFile } from "../../helpers/jsonfs";

const config = loadFromFile("../../../config.json");

function getRmbProxy(): string {
    let rmb_proxy = "";
    // Check for rmb proxy value from arguments
    argv.forEach((val, ind, arr) => {
        if (val == "--proxy" || val == "-p") {
            rmb_proxy = arr[ind + 1];
        }
    });

    if (rmb_proxy) {
        return rmb_proxy;
    }

    // Check for rmb proxy value from config
    if (config.rmb_proxy) {
        return config.rmb_proxy;
    }

    // Check for rmb proxy value from env
    if (env.RMB_PROXY) {
        return env.RMB_PROXY;
    }
    return rmb_proxy;
}

// MsgBusClientInterface
function getRMBClient(): MessageBusClientInterface {
    const rmb_proxy = getRmbProxy();
    if (rmb_proxy) {
        return new HTTPMessageBusClient(config.twin_id, rmb_proxy);
    } else {
        return new MessageBusClient();
    }
}

export { getRMBClient };
