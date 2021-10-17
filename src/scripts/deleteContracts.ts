import { TFClient } from "../tf-grid/client";
import { Contracts } from "../tf-grid/contracts";

async function main() {
    const c = new TFClient(
        "wss://tfchain.dev.threefold.io",
        "muffin reward plug grant able market nerve orphan token foster major relax",
    );
    await c.connect();
    const contracts = [228];
    const C = new Contracts(c);

    for (const contract of contracts) {
        console.log(contract);
        const res = await C.cancel(contract);
        console.log(res);
    }
    c.disconnect();
}
