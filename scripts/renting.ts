import { getClient } from "./client_loader";
import { log } from "./utils";

async function main() {
    const client = await getClient();

    // const res = await client.capacity.filterNodes({ dedicated: true });
    // log(res);

    const res = await client.capacity.filterNodes({ availableFor: client.twinId });
    log(res);

    // const res = await client.nodes.reserve({ nodeId: 22 });
    // log(res);

    // const res = await client.nodes.getRent({ nodeId: 12 });
    // log(res);

    // const res = await client.nodes.unreserve({ nodeId: 12 });
    // log(res);

    await client.disconnect();
}

main();
