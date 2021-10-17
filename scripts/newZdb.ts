import "reflect-metadata";

import { ZDBModel, ZDBSModel, ZDBDeleteModel } from "../src/modules/models";
import { ZdbModes, DeviceTypes } from "../src/zos/zdb";


import { getClient } from "./base";

const grid3 = getClient();

// create zdb object
const zdb = new ZDBModel();
zdb.name = "hamada";
zdb.node_id = 18;
zdb.mode = ZdbModes.user;
zdb.disk_size = 9;
zdb.disk_type = DeviceTypes.ssd;
zdb.public = false;
zdb.namespace = "test";
zdb.password = "testzdb";

// create zdbs object
const zdbs = new ZDBSModel();
zdbs.name = "tttzdbs";
zdbs.zdbs = [zdb];
zdbs.metadata = '{"test": "test"}';

async function main() {
    // const res = await grid3.zdbs.deploy(zdbs);
    // console.log(JSON.stringify(res));

    // get the deployment
    const l = await grid3.zdbs.getPrettyObj(zdbs.name);
    console.log(l);
}

main();
