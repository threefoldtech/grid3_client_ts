import "reflect-metadata";

import { log } from "./utils";
import { NetworkModel, MachineModel, MachinesModel, DiskModel, MachinesDeleteModel } from "../src/modules/models";
import { getClient } from "./client_loader";

// create network Object
const n = new NetworkModel();
n.name = "wedtest";
n.ip_range = "10.249.0.0/16";

// create disk Object
const disk = new DiskModel();
disk.name = "wedDisk";
disk.size = 8;
disk.mountpoint = "/testdisk";

// create vm node Object
const vm = new MachineModel();
vm.name = "testvm";
vm.node_id = 17;
vm.disks = [disk];
vm.public_ip = false;
vm.planetary = true;
vm.cpu = 1;
vm.memory = 1024 * 2;
vm.rootfs_size = 1;
vm.flist = "https://hub.grid.tf/tf-official-apps/base:latest.flist";
vm.entrypoint = "/sbin/zinit init";
vm.env = {
    SSH_KEY:
        "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQCt1LYcIga3sgbip5ejiC6R7CCa34omOwUilR66ZEvUh/u4RpbZ9VjRryVHVDyYcd/qbUzpWMzqzFlfFmtVhPQ0yoGhxiv/owFwStqddKO2iNI7T3U2ytYLJqtPm0JFLB5n07XLyFRplq0W2/TjNrYl51DedDQqBJDq34lz6vTkECNmMKg9Ld0HpxnpHBLH0PsXMY+JMZ8keH9hLBK61Mx9cnNxcLV9N6oA6xRCtwqOdLAH08MMaItYcJ0UF/PDs1PusJvWkvsH5/olgayeAReI6JFGv/x4Eqq5vRJRQjkj9m+Q275gzf9Y/7M/VX7KOH7P9HmDbxwRtOq1F0bRutKF",
};

// create VMs Object
const vms = new MachinesModel();
vms.name = "newVMS";
vms.network = n;
vms.machines = [vm];
vms.metadata = "{'testVMs': true}";
vms.description = "test deploying VMs via ts grid3 client";

async function main() {
    const grid3 = await getClient();

    // deploy vms
    // grid3.machines.deploy(vms)
    //     .then(res => {
    //         log(res);
    //         grid3.machines.getObj(vms.name)
    //             .then(res_l => {
    //                 log(res_l);
    //             })
    //             .catch(err => {
    //                 console.log(err);
    //                 process.exit(1);
    //             })
    //             .finally(() => {
    //                 grid3.disconnect();
    //             })
    //     })
    //     .catch(err => {
    //         grid3.disconnect();
    //         console.log(err);
    //         process.exit(1);
    //     })

    // deploy vms
    try {
        const res = await grid3.machines.deploy(vms);
        log(res);

        // get the deployment
        const l = await grid3.machines.getObj(vms.name + "x");
        log(l);
    }
    catch (err) {
        console.log(err);
        process.exit(1);
    }
    finally {
        grid3.disconnect();
    }

    // // delete
    // const d = await grid3.machines.delete({ name: vms.name });
    // log(d);

};


main();
