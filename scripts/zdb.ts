import "reflect-metadata";

import { ZDBModel, ZDBSModel, ZDBDeleteModel } from "../src/modules/models";
import { ZdbModes } from "../src/zos/zdb";

import { getClient } from "./client_loader";

// create zdb object
const zdb = new ZDBModel();
zdb.name = "hamada";
zdb.node_id = 18;
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

    const res = await grid3.zdbs.deploy(zdbs);
    console.log(JSON.stringify(res));

    // get the deployment
    const l = await grid3.zdbs.getObj(zdbs.name);
    console.log(l);

    // // delete
    // const m = new ZDBDeleteModel();
    // m.name = zdbs.name;
    // const d = await grid3.zdbs.delete(m);
    // console.log(d);

    grid3.disconnect();
}

main();
