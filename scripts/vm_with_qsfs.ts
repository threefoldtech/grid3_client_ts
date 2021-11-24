import "reflect-metadata";

import { log } from "./utils";
import { getClient } from "./client_loader";

const qsfs_name = "wed2710q1";
const machines_name = "wed2710t1";

const qsfs = {
    name: qsfs_name,
    count: 8,
    node_ids: [16, 17],
    password: "mypassword",
    disk_size: 10,
    description: "my qsfs test",
    metadata: "",
}

const vms = {
    name: machines_name,
    network: {
        name: "wed2710n1",
        ip_range: "10.201.0.0/16",
    },
    machines: [
        {
            name: "wed2710v1",
            node_id: 17,
            disks: [
                {
                    name: "wed2710d1",
                    size: 10,
                    mountpoint: "/mydisk",
                },
            ],
            qsfs_disks: [
                {
                    qsfs_zdbs_name: qsfs_name,
                    name: "wed2710d2",
                    minimal_shards: 2,
                    expected_shards: 4,
                    encryption_key: "hamada",
                    prefix: "hamada",
                    cache: 1,
                    mountpoint: "/myqsfsdisk",
                },
            ],
            public_ip: false,
            planetary: true,
            cpu: 1,
            memory: 1024 * 2,
            rootfs_size: 1,
            flist: "https://hub.grid.tf/tf-official-apps/base:latest.flist",
            entrypoint: "/sbin/zinit init",
            env: {
                SSH_KEY:
                    "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQCt1LYcIga3sgbip5ejiC6R7CCa34omOwUilR66ZEvUh/u4RpbZ9VjRryVHVDyYcd/qbUzpWMzqzFlfFmtVhPQ0yoGhxiv/owFwStqddKO2iNI7T3U2ytYLJqtPm0JFLB5n07XLyFRplq0W2/TjNrYl51DedDQqBJDq34lz6vTkECNmMKg9Ld0HpxnpHBLH0PsXMY+JMZ8keH9hLBK61Mx9cnNxcLV9N6oA6xRCtwqOdLAH08MMaItYcJ0UF/PDs1PusJvWkvsH5/olgayeAReI6JFGv/x4Eqq5vRJRQjkj9m+Q275gzf9Y/7M/VX7KOH7P9HmDbxwRtOq1F0bRutKF",
            },
        },
    ],
    metadata: "{'testVMs': true}",
    description: "test deploying VMs via ts grid3 client",
}


async function cancel(grid3) {
    // delete
    const d = await grid3.machines.delete({ name: machines_name });
    log(d);
    const r = await grid3.qsfs_zdbs.delete({ name: qsfs_name });
    log(r);
}

async function main() {
    const grid3 = await getClient();
    //deploy qsfs
    try {
        const res = await grid3.qsfs_zdbs.deploy(qsfs);
        log(">>>>>>>>>>>>>>>QSFS backend has been created<<<<<<<<<<<<<<<");
        log(res);

        const vm_res = await grid3.machines.deploy(vms);
        log(">>>>>>>>>>>>>>>vm has been created<<<<<<<<<<<<<<<");
        log(vm_res);

        // get the deployment
        const l = await grid3.machines.getObj(vms.name);
        log(">>>>>>>>>>>>>>>Deployment result<<<<<<<<<<<<<<<");
        log(l);

        // await cancel(grid3);
    }
    catch (err) {
        console.log(err);
        process.exit(1);
    }
    finally {
        grid3.disconnect();
    }

}

main();
