
import { HTTPMessageBusClient } from "ts-rmb-http-client"



function delay(s: number) {
    return new Promise( resolve => setTimeout(resolve, s*1000) );
}

async function main() {
    const dstNodeId = 50;

    async function deploy() {

        let rmb = new HTTPMessageBusClient("https://rmbproxy1.devnet.grid.tf");
        let msg = rmb.prepare("zos.statistics.get", [dstNodeId], 0, 2);
        console.log(msg)
        const retMsg = await rmb.send(msg, "")
        console.log(retMsg)
        
        // set the retqueue to oringnal message
        await delay(3);

        const result = await rmb.read(retMsg);
        console.log(`the read response is: ${JSON.stringify(result)}`);
    }

    deploy()
}

main()
