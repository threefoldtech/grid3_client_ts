import { getClient } from "./client_loader";
import { log } from "./utils";

async function main() {
    const grid3 = await getClient();

    grid3.contracts
        .getDeletionTime({ id: 1834 })
        .then(deleteionTime => {
            log(deleteionTime);
        })
        .catch(err => {
            throw err;
        })
        .finally(() => {
            grid3.disconnect();
        });
}

main();
