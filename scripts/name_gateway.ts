import { FilterOptions, GatewayNameModel } from "../src";
import { getClient } from "./client_loader";
import { log } from "./utils";

// read more about the gateway types in this doc: https://github.com/threefoldtech/zos/tree/main/docs/gateway
async function main() {
    const grid3 = await getClient();

    const gatewayQueryOptions: FilterOptions = {
        gateway: true,
        farmId: 1,
    };

    const gw = new GatewayNameModel();
    gw.name = "test";
    gw.node_id = +(await grid3.capacity.filterNodes(gatewayQueryOptions))[0].nodeId;
    gw.tls_passthrough = false;
    // the backends have to be in this format `http://ip:port` or `https://ip:port`, and the `ip` pingable from the node so using the ygg ip or public ip if available.
    gw.backends = ["http://185.206.122.35:8000"];

    // deploy
    const res = await grid3.gateway.deploy_name(gw);
    log(res);

    // get the deployment
    const l = await grid3.gateway.getObj(gw.name);
    log(l);

    // // delete
    // const d = await grid3.gateway.delete_name({ name: gw.name });
    // log(d);

    grid3.disconnect();
}

main();
