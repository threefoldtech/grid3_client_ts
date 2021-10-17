// import { DeployGatewayFQDNModel, DeployGatewayNameModel } from "../dist/node/modules/models";
// import { GatewayFQDNProxy, GatewayNameProxy } from "../dist/node/zos/gateway";
// import { GWModule } from "../dist/node/modules/gateway";
// import { HTTPMessageBusClient } from "ts-rmb-http-client";
// import { TWIN_ID, MNEMONICS, TFCHAIN_URL } from "./env";
// const rmb = new HTTPMessageBusClient(~~TWIN_ID, "https://rmbproxy1.testnet.grid.tf");
// const gwDeployment = new GWModule(~~TWIN_ID, TFCHAIN_URL, MNEMONICS, rmb);
// function get(name: string) {
//     return gwDeployment.getPrettyObj(name);
// }
// function listDeploymentNames(): string[] {
//     return gwDeployment._list();
// }
// function listAll() {
//     return listDeploymentNames().map(d => ({ d: get(d) }));
// }
// async function remove(name: string) {
//     // delete the deployment
//     const d = await gwDeployment._delete(name);
//     console.log(d);
// }
// async function deployFQDN() {
//     const gw = new DeployGatewayFQDNModel();
//     gw.name = "testFQDN";
//     gw.node_id = 4;
//     gw.fqdn = "";
//     gw.tls_passthrough = true;
//     gw.backends = ["test"];
//     const res = await gwDeployment.deploy_fqdn(gw);
//     console.log(JSON.stringify(res));
//     // get the deployment
//     const l = await gwDeployment.getPrettyObj(gw.name);
//     console.log(l);
// }
// function main() {
//     deployFQDN();
// }
// main();
