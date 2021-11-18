import { HTTPMessageBusClient } from "ts-rmb-http-client";
async function main() {

    const myTwin = 74;
    const node_twin_id = 12;
    const cmd = "zos.deployment.get";
    const payload = JSON.stringify({ contract_id: 557 });
    let rmb = new HTTPMessageBusClient(myTwin, "https://gridproxy.dev.grid.tf");
    let msg = rmb.prepare(cmd, [node_twin_id], 0, 2);
    await rmb.send(msg, payload);
    const result = await rmb.read(msg);
    console.log(result);
}
main();