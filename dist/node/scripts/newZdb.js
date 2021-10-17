"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const models_1 = require("../src/modules/models");
const zdb_1 = require("../src/zos/zdb");
const base_1 = require("./base");
const grid3 = (0, base_1.getClient)();
// create zdb object
const zdb = new models_1.ZDBModel();
zdb.name = "hamada";
zdb.node_id = 18;
zdb.mode = zdb_1.ZdbModes.user;
zdb.disk_size = 9;
zdb.disk_type = zdb_1.DeviceTypes.ssd;
zdb.public = false;
zdb.namespace = "test";
zdb.password = "testzdb";
// create zdbs object
const zdbs = new models_1.ZDBSModel();
zdbs.name = "tttzdbs";
zdbs.zdbs = [zdb];
zdbs.metadata = '{"test": "test"}';
async function main() {
    const res = await grid3.zdbs.deploy(zdbs);
    console.log(JSON.stringify(res));
    // get the deployment
    const l = await grid3.zdbs.getPrettyObj(zdbs.name);
    console.log(l);
}
main();
