import fs from "fs";

import { appPath } from "../src";
import { getClient } from "./client_loader";

async function teardown() {
    const gridClient = await getClient();
    const deletedContracts = await gridClient.contracts.cancelMyContracts();
    console.log("deletedContracts:", deletedContracts);
    const keys = await gridClient.kvstore.removeAll();
    console.log("deletedKeys:", keys);
    if (fs.existsSync(appPath)) {
        fs.rmSync(appPath, { recursive: true });
    }
    return await gridClient.disconnect();
}

teardown();
