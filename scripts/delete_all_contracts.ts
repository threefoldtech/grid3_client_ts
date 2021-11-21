import { log } from "./utils";
import "reflect-metadata";
import { getClient } from "./client_loader";


async function main() {
    const grid3 = await getClient();

    const cancellation_res = await grid3.contracts.cancelMyContracts();

    log(cancellation_res);
    grid3.disconnect();
}

main();