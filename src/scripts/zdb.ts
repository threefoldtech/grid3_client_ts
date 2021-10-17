import { ZDBModel, ZDBSModel, ZDBDeleteModel } from "../modules/models";
import { ZdbModes, DeviceTypes } from "../zos/zdb";
import { ZdbsModule } from "../modules/zdb";

import { HTTPMessageBusClient } from "ts-rmb-http-client";

const rmb = new HTTPMessageBusClient(3, "https://rmbproxy1.devnet.grid.tf");
const zdbDeployment = new ZdbsModule(
    3,
    "wss://tfchain.dev.threefold.io",
    "muffin reward plug grant able market nerve orphan token foster major relax",
    rmb,
);
function get(name: string) {
    return zdbDeployment.getPrettyObj(name);
}

function listDeploymentNames(): string[] {
    return zdbDeployment.list();
}

function listAll() {
    let ret = {};
    listDeploymentNames().forEach(d => {
        ret[d] = get(d);
    });
}

async function remove(name: string) {
    // delete the deployment
    const m = new ZDBDeleteModel();
    m.name = name;
    const d = await zdbDeployment.delete(m);
    console.log(d);
}

async function deploy() {
    // create zdb object
    const zdb = new ZDBModel();
    zdb.name = "testzdb";
    zdb.node_id = 4;
    zdb.mode = ZdbModes.user;
    zdb.disk_size = 10;
    zdb.disk_type = DeviceTypes.ssd;
    zdb.public = false;
    zdb.namespace = "test";
    zdb.password = "test";

    // create zdbs object
    const zdbs = new ZDBSModel();
    zdbs.name = "wedzdbs";
    zdbs.zdbs = [zdb];
    zdbs.metadata = "";
    zdbs.description = "";

    const res = await zdbDeployment.deploy(zdbs);
    console.log(JSON.stringify(res));

    // get the deployment
    const l = await zdbDeployment.getPrettyObj(zdbs.name);
    console.log(l);

}

function main() {
    // deploy();
    listAll();
}

main();
