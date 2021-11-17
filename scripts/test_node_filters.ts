import "reflect-metadata";

import { log } from "./utils";
import { GridClient } from "../src/client";
import { Nodes } from "../src/primitives";

import { getClient } from "./client_loader";

async function main() {
    const grid3 = await getClient();
    const nodes = new Nodes(GridClient.config.graphqlURL, GridClient.config.rmbClient["proxyURL"]);
    try {
        log("getFarms");
        const f = await nodes.getFarms();
        log(f);

        log("getNodes");
        const n = await nodes.getNodes();
        log(n);

        log("getNodesByFarmID(2)");
        const z = await nodes.getNodesByFarmID(1);
        log(z);

        log("freeCapacity(64)");
        const c = await nodes.freeCapacity(1);
        log(c);

        log("filterNodes");
        const x = await nodes.filterNodes({
            country: "BE",
            cru: 20,
            sru: 50,
        });
        log(x);
    } catch (e) {
        console.error(e);
    } finally {
        await grid3.disconnect();
    }
}

main();
