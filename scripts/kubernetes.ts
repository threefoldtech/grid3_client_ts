import { FilterOptions, K8SModel, KubernetesNodeModel, NetworkModel } from "../src";
import { config, getClient } from "./client_loader";
import { log } from "./utils";

async function main() {
    const grid3 = await getClient();

    // create network Object
    const n = new NetworkModel();
    n.name = "monNetwork";
    n.ip_range = "10.238.0.0/16";
    n.addAccess = true;

    const server1_options: FilterOptions = {
        cru: 3,
        mru: 6, // GB
        sru: 20,
        farmId: 1,
    };

    // create k8s node Object
    const master = new KubernetesNodeModel();
    master.name = "master";
    try {
        master.node_id = +(await grid3.capacity.filterNodes(server1_options))[0].nodeId;
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
    master.cpu = 1;
    master.memory = 1024 * 2;
    master.rootfs_size = 0;
    master.disk_size = 8;
    master.public_ip = false;
    master.planetary = true;

    // create k8s node Object
    const worker = new KubernetesNodeModel();
    worker.name = "worker";
    try {
        worker.node_id = +(await grid3.capacity.filterNodes(server1_options))[0].nodeId;
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
    worker.cpu = 2;
    worker.memory = 1024 * 4;
    worker.rootfs_size = 0;
    worker.disk_size = 8;
    worker.public_ip = false;
    worker.planetary = true;

    // create k8s Object
    const k = new K8SModel();
    k.name = "testk8s";
    k.secret = "secret";
    k.network = n;
    k.masters = [master];
    k.workers = [worker];
    k.metadata = "{'testk8s': true}";
    k.description = "test deploying k8s via ts grid3 client";
    k.ssh_key = config.ssh_key;

    // deploy
    const res = await grid3.k8s.deploy(k);
    log(res);

    // get the deployment
    const l = await grid3.k8s.getObj(k.name);
    log(l);

    // // delete
    // const d = await grid3.k8s.delete({ name: k.name });
    // log(d);

    await grid3.disconnect();
}

main();
