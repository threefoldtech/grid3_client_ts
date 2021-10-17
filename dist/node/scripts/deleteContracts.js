"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("../dist/node/tf-grid/client");
async function main() {
    const c = new client_1.TFClient("wss://tfchain.test.threefold.io", "muffin reward plug grant able market nerve orphan token foster major relax");
    await c.connect();
    const contracts = [8, 9];
    try {
        for (const contract of contracts) {
            console.log(contract);
            const res = await c.contracts.cancel(contract);
            console.log(res);
        }
    }
    catch (err) {
        console.log(err);
    }
    finally {
        c.disconnect();
    }
}
main();
