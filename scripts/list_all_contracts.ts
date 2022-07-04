import { getClient } from "./client_loader";
import { log } from "./utils";

async function main() {
    const grid3 = await getClient();

    grid3.contracts
        .listMyContracts()
        .then(res => {
            log(res);
        })
        .catch(err => {
            throw err;
        })
        .finally(() => {
            grid3.disconnect();
        });
}

main();
