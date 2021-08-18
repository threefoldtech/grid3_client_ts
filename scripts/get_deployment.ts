import { MessageBusClient } from "../rmb/client"

const node_twin_id = 7;

const payload = JSON.stringify({ 'contract_id': 212 })
let rmb = new MessageBusClient(6379);
let msg = rmb.prepare("zos.deployment.get", [node_twin_id], 0, 2);
rmb.send(msg, payload);
rmb.read(msg, function (result) {
    console.log("result received")
    console.log(result)
})