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
    db.set({ key, value: JSON.stringify(exampleObj) })
        .then(() => {
            // list all the keys
            db.list()
                .then(keys => {
                    log(keys);
                    // get the key
                    db.get({ key })
                        .then(data => {
                            log(JSON.parse(data));
                        })
                        .catch(err_get => {
                            console.log(err_get);
                            process.exit(1);
                        })
                })
                .catch(err_list => {
                    console.log(err_list);
                    process.exit(1);
                })
                .finally(() => {
                    // remove the key
                    db.remove({ key })
                        .then(() => {
                            console.log("removed key")
                        })
                        .catch(err_remove => {
                            console.log(err_remove);
                            process.exit(1);
                        })
                        .finally(() => {
                            // disconnect
                            gridClient.disconnect();
                        });
                });
        })
        .catch(err => {
            gridClient.disconnect();
            console.log(err);
            process.exit(1);
        });

}

main();
