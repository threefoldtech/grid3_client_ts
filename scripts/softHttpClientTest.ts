
import { HTTPMessageBusClient } from "../src/rmb/httpClient"



function delay(s: number) {
    return new Promise( resolve => setTimeout(resolve, s*1000) );
}

async function main() {
    const dstNodeId = 38;

    async function deploy() {

        let rmb = new HTTPMessageBusClient("https://rmbproxy1.devnet.grid.tf");
        let msg = rmb.prepare("zos.statistics.get", [dstNodeId], 0, 2);
        console.log(msg)
        const messageIdentifier = await rmb.send(msg, "")
        console.log(messageIdentifier)
        
        // set the retqueue to oringnal message
        msg.ret = messageIdentifier["retqueue"];
        await delay(7);

        const result = await rmb.read(msg)
        console.log(`the read response is: ${result}`)
    }

    deploy()
}

main()
