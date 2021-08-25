import { MessageBusClient } from "../src/rmb/client"

async function main() {
    const node_twin_id = 5;
    const payload = JSON.stringify({ 'contract_id': 203 })
    let rmb = new MessageBusClient(6379);
    let msg = rmb.prepare("zos.deployment.get", [node_twin_id], 0, 2);
    rmb.send(msg, payload);
    const result = await rmb.read(msg)
    console.log(result)
}
main()