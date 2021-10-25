import { TFClient } from "../tf-grid/client";
import { Contracts } from "../tf-grid/contracts";

async function main() {
    const c = new TFClient(
        "wss://tfchain.dev.threefold.io",
        "muffin reward plug grant able market nerve orphan token foster major relax",
    );
    await c.connect();
    const contracts = [59,60];
    try {
        for (const contract of contracts) {
            console.log(contract);
            const res = await c.contracts.cancel(contract);
            console.log(res);
        }
    } catch (err) {
        console.log(err);
    } finally {
        c.disconnect();
    }
}

main();
