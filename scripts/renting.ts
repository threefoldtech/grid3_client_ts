import { getClient } from "./client_loader";
import { log } from "./utils";

async function main() {
    const client = await getClient();

    // waiting for the dedicated filter on gridproxy
    // const res = await client.capacity.filterNodes({ dedicated: true });
    // log(res)

    // const res = await client.nodes.reserve({ nodeId: 12 });
    // log(res);

    const res = await client.nodes.getRent({ nodeId: 12 });
    log(res);

    // const res = await client.nodes.unreserve({ nodeId: 12 });
    // log(res);

    await client.disconnect();
}

main();
