import "reflect-metadata";

import { getClient } from "./client_loader";

async function main() {
    const grid3 = await getClient();
    try {
        console.log("getFarms");
        let f = await grid3.scheduler.getFarms();
        console.log(f);
        
        console.log("getNodes");
        let n = await grid3.scheduler.getNodes();
        console.log(n);
        
        console.log("getNodesByFarmID(2)");
        let z = await grid3.scheduler.getNodesByFarmID(1);
        console.log(z);
        
        console.log("freeCapacity(64)");
        let c = await grid3.scheduler.freeCapacity(1);
        console.log(c);
        
        console.log("filterNodes");
        let x = await grid3.scheduler.filterNodes({
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
