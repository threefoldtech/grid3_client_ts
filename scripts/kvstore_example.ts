import "reflect-metadata";

import { log } from "./utils";
import { getClient } from "./client_loader";

const exampleObj = {
    key1: "value1",
    key2: 2,
};

/*
KVStore example usage:
*/
async function main() {
    //For creating grid3 client with KVStore, you need to specify the KVStore storage type in the pram:

    const gridClient = await getClient();

    //then every module will use the KVStore to save its configuration and restore it.

    // also you can use it like this:
    const db = gridClient.kvstore;

    // set key
    const key = "hamada";

    try {
        // set key
        await db.set({ key, value: JSON.stringify(exampleObj) });

        // list all the keys
        const keys = await db.list();
        log(keys);

        // get the key
        const data = await db.get({ key });
        log(JSON.parse(data));

        // remove the key
        await db.remove({ key });
    }
    catch (err) {
        console.log(err);
        process.exit(1);
    }
    finally {
        gridClient.disconnect();
    }

}

main();
