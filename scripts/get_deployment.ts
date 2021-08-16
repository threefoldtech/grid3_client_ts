import { MessageBusClient } from "../rmb-client/client"

const node_twin_id = 6;

const payload = JSON.stringify({ 'contract_id': 164 })
let rmb = new MessageBusClient(6379);
let msg = rmb.prepare("zos.deployment.get", [node_twin_id], 0, 2);
rmb.send(msg, payload);
rmb.read(msg, function (result) {
    console.log("result received")
    console.log(result)
})