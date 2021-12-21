import { DiskModel, MachineModel, MachinesModel, NetworkModel } from "../src";
import { config, getClient } from "./client_loader";
import { log } from "./utils";

// create network Object
const n = new NetworkModel();
n.name = "monNetwork";
n.ip_range = "10.238.0.0/16";

// create disk Object
const disk1 = new DiskModel();
disk1.name = "newDisk";
disk1.size = 10;
disk1.mountpoint = "/newDisk";

// create vm node Object
const vm1 = new MachineModel();
vm1.name = "testvm";
vm1.node_id = 16;
vm1.disks = [disk1];
vm1.public_ip = false;
vm1.planetary = true;
vm1.cpu = 1;
vm1.memory = 1024 * 2;
vm1.rootfs_size = 1;
vm1.flist = "https://hub.grid.tf/tf-official-apps/base:latest.flist";
vm1.entrypoint = "/sbin/zinit init";
vm1.env = {
    SSH_KEY:
        "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQCt1LYcIga3sgbip5ejiC6R7CCa34omOwUilR66ZEvUh/u4RpbZ9VjRryVHVDyYcd/qbUzpWMzqzFlfFmtVhPQ0yoGhxiv/owFwStqddKO2iNI7T3U2ytYLJqtPm0JFLB5n07XLyFRplq0W2/TjNrYl51DedDQqBJDq34lz6vTkECNmMKg9Ld0HpxnpHBLH0PsXMY+JMZ8keH9hLBK61Mx9cnNxcLV9N6oA6xRCtwqOdLAH08MMaItYcJ0UF/PDs1PusJvWkvsH5/olgayeAReI6JFGv/x4Eqq5vRJRQjkj9m+Q275gzf9Y/7M/VX7KOH7P9HmDbxwRtOq1F0bRutKF",
};

// create disk Object
const disk2 = new DiskModel();
disk2.name = "newDisk";
disk2.size = 10;
disk2.mountpoint = "/newDisk";

// create another vm node Object
const vm2 = new MachineModel();
vm2.name = "testvm";
vm2.node_id = 7;
vm2.disks = [disk2];
vm2.public_ip = false;
vm2.planetary = true;
vm2.cpu = 1;
vm2.memory = 1024 * 2;
vm2.rootfs_size = 1;
vm2.flist = "https://hub.grid.tf/tf-official-apps/base:latest.flist";
vm2.entrypoint = "/sbin/zinit init";
vm2.env = {
    SSH_KEY: config.ssh_key,
};

// create VMs Object
const vms = new MachinesModel();
vms.name = "monVMS";
vms.network = n;
vms.machines = [vm1, vm2];
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

    await grid3.disconnect();
}

main();
