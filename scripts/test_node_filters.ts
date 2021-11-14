import "reflect-metadata";
import { GridClient } from "../src/client";
import { Nodes } from "../src/primitives";

import { getClient } from "./client_loader";

async function main() {
    const grid3 = await getClient();
    const nodes = new Nodes(GridClient.config.graphqlURL, GridClient.config.rmbClient["proxyURL"]);
    try {
        console.log("getFarms");
        let f = await nodes.getFarms();
        console.log(f);

        console.log("getNodes");
        let n = await nodes.getNodes();
        console.log(n);

        console.log("getNodesByFarmID(2)");
        let z = await nodes.getNodesByFarmID(1);
        console.log(z);

        console.log("freeCapacity(64)");
        let c = await nodes.freeCapacity(1);
        console.log(c);

        console.log("filterNodes");
        let x = await nodes.filterNodes({
            country: "BE",
            cru: 20,
            sru: 50,
        });
        console.log(x);
    } catch (e) {
        console.error(e);
    } finally {
        await grid3.disconnect();
    }
}

main();
