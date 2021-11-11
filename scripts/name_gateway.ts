import "reflect-metadata";

import { GatewayNameModel, GatewayNameDeleteModel } from "../src/modules/models";

import { getClient } from "./client_loader";

// read more about the gateway types in this doc: https://github.com/threefoldtech/zos/tree/main/docs/gateway

const gw = new GatewayNameModel();
gw.name = "test";
gw.node_id = 1;
gw.tls_passthrough = false;
// the backends have to be in this format `http://ip:port` or `https://ip:port`, and the `ip` pingable from the node so using the ygg ip or public ip if available.
gw.backends = ["http://185.206.122.35:8000"];

async function main() {
    const grid3 = await getClient();

    // deploy
    const res = await grid3.gateway.deploy_name(gw);
    console.log(JSON.stringify(res));

    // get the deployment
    const l = await grid3.gateway.getObj(gw.name);
    console.log(l);

    // // delete
    // const m = new GatewayNameDeleteModel();
    // m.name = gw.name;
    // const d = await grid3.gateway.delete_name(m);
    // console.log(d);

    grid3.disconnect();
}

main();
