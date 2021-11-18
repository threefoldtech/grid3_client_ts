import { HTTPMessageBusClient } from "ts-rmb-http-client";

async function main() {
    const myTwin = 106;
    const node_twin_id = 15;
    const cmd = "zos.deployment.get";
    const payload = JSON.stringify({ contract_id: 783 });
    let rmb = new HTTPMessageBusClient(myTwin, "https://gridproxy.test.grid.tf");
    let msg = rmb.prepare(cmd, [node_twin_id], 0, 2);
    await rmb.send(msg, payload);
    const result = await rmb.read(msg);
    console.log(result);
}
main();