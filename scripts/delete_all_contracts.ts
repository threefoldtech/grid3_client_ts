import { log } from "./utils";
import "reflect-metadata";
import { getClient } from "./client_loader";


async function main() {
    const grid3 = await getClient();

    grid3.contracts.cancelMyContracts()
        .then(cancellation_res => {
            log(cancellation_res);
        })
        .catch(err => {
            throw err;
        })
        .finally(() => {
            grid3.disconnect();
        });

};

main();