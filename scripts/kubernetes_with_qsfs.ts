import "reflect-metadata";

import { NetworkModel, K8SModel, KubernetesNodeModel, K8SDeleteModel } from "../src/modules/models";
import { getClient } from "./client_loader";

const qsfs_name = "testQsfsK8sq1";

// create network Object
const n = new NetworkModel();
n.name = "tuesNetwork";
n.ip_range = "10.238.0.0/16";

// create k8s node Object
const master = new KubernetesNodeModel();
master.name = "master";
master.node_id = 16;
master.cpu = 1;
master.memory = 1024 * 2;
master.rootfs_size = 1;
master.disk_size = 8;
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
]

// create k8s node Object
const worker = new KubernetesNodeModel();
worker.name = "worker";
worker.node_id = 16;
worker.cpu = 2;
worker.memory = 1024 * 4;
worker.rootfs_size = 1;
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
k.ssh_key =
    "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQCt1LYcIga3sgbip5ejiC6R7CCa34omOwUilR66ZEvUh/u4RpbZ9VjRryVHVDyYcd/qbUzpWMzqzFlfFmtVhPQ0yoGhxiv/owFwStqddKO2iNI7T3U2ytYLJqtPm0JFLB5n07XLyFRplq0W2/TjNrYl51DedDQqBJDq34lz6vTkECNmMKg9Ld0HpxnpHBLH0PsXMY+JMZ8keH9hLBK61Mx9cnNxcLV9N6oA6xRCtwqOdLAH08MMaItYcJ0UF/PDs1PusJvWkvsH5/olgayeAReI6JFGv/x4Eqq5vRJRQjkj9m+Q275gzf9Y/7M/VX7KOH7P9HmDbxwRtOq1F0bRutKF";

async function main() {
    const grid3 = await getClient();
    // deploy qsfs

    const qsfs_res = await grid3.qsfs_zdbs.deploy({
        name: qsfs_name,
        count: 8,
        node_ids: [2, 3],
        password: "mypassword",
        disk_size: 10,
        description: "my qsfs test",
        metadata: "",
    });

    // deploy k8s
    const res = await grid3.k8s.deploy(k);
    console.log(res);

    // get the deployment
    const l = await grid3.k8s.getObj(k.name);
    console.log(l);

    grid3.disconnect();
}

main();
