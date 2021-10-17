// import { ZDBModel, ZDBSModel, ZDBDeleteModel } from "../dist/node/modules/models";
// import { ZdbModes, DeviceTypes } from "../dist/node/zos/zdb";
// import { ZdbsModule } from "../dist/node/modules/zdb";
// import { TWIN_ID, MNEMONICS, TFCHAIN_URL } from "./env";
// import { HTTPMessageBusClient } from "ts-rmb-http-client";
// if (!(TWIN_ID || MNEMONICS || TFCHAIN_URL)) {
//     throw Error("Can not find MNEMONICS or Twin_ID in the environment variables");
// }
// const rmb = new HTTPMessageBusClient(parseInt(TWIN_ID), "https://rmbproxy1.testnet.grid.tf");
// const zdbDeployment = new ZdbsModule(parseInt(TWIN_ID), TFCHAIN_URL, MNEMONICS, rmb, "");
// async function get(name: string) {
//     return await zdbDeployment.getPrettyObj(name);
// }
// function listDeploymentNames(): string[] {
//     return zdbDeployment.list();
// }
// function listAll() {
//     return listDeploymentNames().map(d => ({ d: get(d) }));
// }
// async function remove(name: string) {
//     // delete the deployment
//     const m = new ZDBDeleteModel();
//     m.name = name;
//     const d = await zdbDeployment.delete(m);
//     console.log(d);
// }
// async function deploy() {
//     // create zdb object
//     const zdb = new ZDBModel();
//     zdb.name = "hamada";
//     zdb.node_id = 18;
//     zdb.mode = ZdbModes.user;
//     zdb.disk_size = 9;
//     zdb.disk_type = DeviceTypes.ssd;
//     zdb.public = false;
//     zdb.namespace = "test";
//     zdb.password = "testzdb";
//     // create zdbs object
//     const zdbs = new ZDBSModel();
//     zdbs.name = "tttzdbs";
//     zdbs.zdbs = [zdb];
//     zdbs.metadata = '{"test": "test"}';
//     const res = await zdbDeployment.deploy(zdbs);
//     console.log(JSON.stringify(res));
//     // get the deployment
//     const l = await zdbDeployment.getPrettyObj(zdbs.name);
//     console.log(l);
// }
// async function main() {
//     // deploy();
//     const p = await get("tttzdbs");
//     console.log(p);
//     // remove("tttzdbs");
//     // listAll();
// }
// main();
