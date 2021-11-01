import "reflect-metadata";

import { GatewayFQDNModel, GatewayFQDNDeleteModel } from "../src/modules/models";

import { getClient } from "./client_loader";

const grid3 = getClient();

// read more about the gateway types in this doc: https://github.com/threefoldtech/zos/tree/main/docs/gateway

const gw = new GatewayFQDNModel();
gw.name = "applyFQDN";
gw.node_id = 1;
gw.fqdn = "test.hamada.grid.tf";
gw.tls_passthrough = false;
gw.backends = ["http://185.206.122.35:8000"];

async function main() {
    // deploy
    const res = await grid3.gateway.deploy_fqdn(gw);
    console.log(JSON.stringify(res));

    // get the deployment
    const l = await grid3.gateway.getObj(gw.name);
    console.log(l);

    // // delete
    // const m = new GatewayFQDNDeleteModel();
    // m.name = gw.name;
    // const d = await grid3.gateway.deleteFQDN(m);
    // console.log(d);
}

main();