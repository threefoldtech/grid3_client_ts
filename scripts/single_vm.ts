import { getClient } from "./client_loader";
import { NetworkModel, MachineModel, MachinesModel, DiskModel, MachinesDeleteModel } from "../src";
import { log } from "./utils";

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
    const res = await grid3.machines.deploy(vms);
    log(res);

    // get the deployment
    const l = await grid3.machines.getObj(vms.name);
    log(l);

    // // delete
    // const d = await grid3.machines.delete({ name: vms.name });
    // log(d);

}

main();
