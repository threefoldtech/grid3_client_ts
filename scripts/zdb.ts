import { FilterOptions, ZDBModel, ZdbModes, ZDBSModel } from "../src";
import { getClient } from "./client_loader";
import { log } from "./utils";

async function main() {
    const grid3 = await getClient();

    const server1_options: FilterOptions = {
        hru: 20,
        farmId: 1,
    };

    // create zdb object
    const zdb = new ZDBModel();
    zdb.name = "hamada";
    try {
        zdb.node_id = +(await grid3.capacity.filterNodes(server1_options))[0].nodeId;
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
    zdb.mode = ZdbModes.user;
    zdb.disk_size = 9;
    zdb.publicNamespace = false;
    zdb.password = "testzdb";

    // create zdbs object
    const zdbs = new ZDBSModel();
    zdbs.name = "tttzdbs";
    zdbs.zdbs = [zdb];
    zdbs.metadata = '{"test": "test"}';

    // deploy zdb
    const res = await grid3.zdbs.deploy(zdbs);
    log(res);

    // get the deployment
    const l = await grid3.zdbs.getObj(zdbs.name);
    log(l);

    // // delete
    // const d = await grid3.zdbs.delete({ name: zdbs.name });
    // log(d);

    await grid3.disconnect();
}

main();
