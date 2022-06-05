import { FilterOptions, K8SModel, KubernetesNodeModel, NetworkModel } from "../src";
import { config, getClient } from "./client_loader";
import { log } from "./utils";

async function main() {
    const grid3 = await getClient();

    const qsfs_name = "testQsfsK8sq1";

    const masterQueryOptions: FilterOptions = {
        cru: 1,
        mru: 2, // GB
        sru: 10,
        farmId: 1,
    };

    const workerQueryOptions: FilterOptions = {
        cru: 2,
        mru: 4, // GB
        sru: 10,
        farmId: 1,
    };

    const qsfsQueryOptions: FilterOptions = {
        hru: 40,
        farmId: 1,
    };

    const qsfsNodes = [];

    const allNodes = await grid3.capacity.filterNodes(qsfsQueryOptions);
    if (allNodes.length >= 2) {
        qsfsNodes.push(+allNodes[0].nodeId, +allNodes[1].nodeId);
    } else {
        throw Error("Couldn't find nodes for qsfs");
    }

    //create qsfs object
    const qsfs = {
        name: qsfs_name,
        count: 8,
        node_ids: qsfsNodes,
        password: "mypassword1",
        disk_size: 10,
        description: "my qsfs test",
        metadata: "",
    };

    // create network Object
    const n = new NetworkModel();
    n.name = "k8sqsfsNetwork";
    n.ip_range = "10.238.0.0/16";

    // create k8s node Object
    const master = new KubernetesNodeModel();
    master.name = "master";
    master.node_id = +(await grid3.capacity.filterNodes(masterQueryOptions))[0].nodeId;
    master.cpu = 1;
    master.memory = 1024 * 2;
    master.rootfs_size = 0;
    master.disk_size = 9;
    master.public_ip = false;
    master.planetary = true;
    master.qsfs_disks = [
        {
            qsfs_zdbs_name: qsfs_name,
            name: "testQsfsK8sd1",
            minimal_shards: 2,
            expected_shards: 4,
            encryption_key: "hamada",
            prefix: "hamada",
            cache: 1,
            mountpoint: "/myqsfsdisk",
        },
    ];

    // create k8s node Object
    const worker = new KubernetesNodeModel();
    worker.name = "worker";
    worker.node_id = +(await grid3.capacity.filterNodes(workerQueryOptions))[0].nodeId;
    worker.cpu = 2;
    worker.memory = 1024 * 4;
    worker.rootfs_size = 0;
    worker.disk_size = 9;
    worker.public_ip = false;
    worker.planetary = true;

    // create k8s Object
    const k = new K8SModel();
    k.name = "testk8sqsfs";
    k.secret = "secret";
    k.network = n;
    k.masters = [master];
    k.workers = [worker];
    k.metadata = "{'testk8s': true}";
    k.description = "test deploying k8s via ts grid3 client";
    k.ssh_key = config.ssh_key;

    // deploy qsfs
    const res = await grid3.qsfs_zdbs.deploy(qsfs);
    log(">>>>>>>>>>>>>>>QSFS backend has been created<<<<<<<<<<<<<<<");
    log(res);

    const kubernetes = await grid3.k8s.deploy(k);
    log(">>>>>>>>>>>>>>>kubernetes has been created<<<<<<<<<<<<<<<");
    log(kubernetes);

    // get the deployment
    const l = await grid3.k8s.getObj(k.name);
    log(">>>>>>>>>>>>>>>Deployment result<<<<<<<<<<<<<<<");
    log(l);

    // // delete
    // const d = await grid3.k8s.delete({ name: k.name });
    // log(d);
    // const r = await grid3.qsfs_zdbs.delete({ name: qsfs_name });
    // log(r);

    await grid3.disconnect();
}

main();
