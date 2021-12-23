import { getClient } from "./client_loader";
import { log } from "./utils";

async function main() {
    const grid3 = await getClient();
    try {
        log("getFarms");
        const f = await grid3.capacity.getFarms();
        log(f);

        log("getNodes");
        const n = await grid3.capacity.getNodes();
        log(n);

        log("getNodesByFarmID(1)");
        const z = await grid3.capacity.getNodesByFarmId({ farmId: 1 });
        log(z);

        log("NodeFreeResources(1)");
        const c = await grid3.capacity.getNodeFreeResources({ nodeId: 1 });
        log(c);

        log("filterNodes");
        const x = await grid3.capacity.filterNodes({
            country: "Belgium",
            publicIPs: true,
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
