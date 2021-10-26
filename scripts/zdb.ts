import "reflect-metadata";

import { ZDBModel, ZDBSModel, ZDBDeleteModel } from "../dist/node/modules/models";
import { ZdbModes } from "../dist/node/zos/zdb";

import { getClient } from "./clientLoader";

const grid3 = getClient();

// create zdb object
const zdb = new ZDBModel();
zdb.name = "hamada";
zdb.node_id = 18;
zdb.mode = ZdbModes.user;
zdb.disk_size = 9;
zdb.public = false;
zdb.password = "testzdb";

// create zdbs object
const zdbs = new ZDBSModel();
zdbs.name = "tttzdbs";
zdbs.zdbs = [zdb];
zdbs.metadata = '{"test": "test"}';

async function main() {
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
}

main();