import "reflect-metadata";

import { log } from "./utils";
import { ZDBModel, ZDBSModel, ZDBDeleteModel } from "../src/modules/models";
import { ZdbModes } from "../src/zos/zdb";
import { getClient } from "./client_loader";

// create zdb object
const zdb = new ZDBModel();
zdb.name = "hamada";
zdb.node_id = 16;
zdb.mode = ZdbModes.user;
zdb.disk_size = 9;
zdb.publicNamespace = false;
zdb.password = "testzdb";

// create zdbs object
const zdbs = new ZDBSModel();
zdbs.name = "tttzdbs";
zdbs.zdbs = [zdb];
zdbs.metadata = '{"test": "test"}';

async function main() {
    const grid3 = await getClient();
    // deploy zdb
    grid3.zdbs.deploy(zdbs)
        .then(res => {
            log(res);
            // get the deployment
            grid3.zdbs.getObj(zdbs.name)
                .then(res_l => {
                    log(res_l);
                })
                .catch(err => {
                    console.log(err);
                    process.exit(1);
                })
                .finally(() => {
                    grid3.disconnect();
                })
        })
        .catch(err => {
            grid3.disconnect();
            console.log(err);
            process.exit(1);
        })

    // // delete
    // const d = await grid3.zdbs.delete({ name: zdbs.name });
    // log(d);
}

main();
