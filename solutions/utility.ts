import "reflect-metadata";
import { getClient } from "./client_loader";

import { ContractCancelModel } from "../src/modules/models";

async function list(client) {
    console.log(`User with TwinID = ${client.twinId} on the "${client.network}" has the following deployments:`);

    const vm_list = await client.machines.list();
    for (const vm of vm_list) {
        const vm_contract = await client.machines.getContract(vm); // edited the src to expose getcontract funtion

        console.log(`[*] "${vm}" with contract ${JSON.stringify(vm_contract)}`);
    }

    //TODO: apply the same for all kind of workloads
    // console.log(`[*] Clusters: ${JSON.stringify(await client.k8s.list())}`);
    // console.log(`[*] zDBs: ${JSON.stringify(await client.zdbs.list())}`);
    // console.log(`[*] QSFS: ${JSON.stringify(await client.qsfs_zdbs.list())}`);
}

async function cancel(grid3, id) {
    const contract = new ContractCancelModel();
    contract.id = id;
    const response = await grid3.contracts.cancel(contract);
    console.log(JSON.stringify(response));
}

async function main() {
    const args = process.argv.slice(2);
    const cmd = args[0];
    const id = args[1];

    const gridClient = await getClient();
    console.log(" ");

    cmd === "list"
        ? await list(gridClient)
        : cmd == "cancel"
        ? await cancel(gridClient, id)
        : console.log("Enter a useful command");

    console.log(" ");
    gridClient.disconnect();
}

main();
