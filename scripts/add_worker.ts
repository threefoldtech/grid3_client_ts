import { AddWorkerModel } from "../src";
import { getClient } from "./client_loader";
import { log } from "./utils";

// Please run kubernetes script first before running this one to create the cluster.

// create k8s node Object
const worker = new AddWorkerModel();
worker.deployment_name = "testk8s";
worker.name = "worker2";
worker.node_id = 17;
worker.cpu = 2;
worker.memory = 1024;
worker.rootfs_size = 0;
worker.disk_size = 8;
worker.public_ip = false;
worker.planetary = true;

async function main() {
    const grid3 = await getClient();
    const res = await grid3.k8s.add_worker(worker);
    log(res);

    // get the deployment
    const l = await grid3.k8s.getObj(worker.deployment_name);
    log(l);

    // // delete
    // const d = await grid3.k8s.delete_worker({name: worker.name, deployment_name:worker.deployment_name});
    // log(d);

    await grid3.disconnect();
}

main();
