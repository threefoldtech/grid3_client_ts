import "reflect-metadata";

import { NetworkModel, MachineModel, MachinesModel, DiskModel, MachinesDeleteModel } from "../dist/node/modules/models";
import { getClient } from "./clientLoader";

const grid3 = getClient();

// create network Object
const n = new NetworkModel();
n.name = "montest";
n.ip_range = "10.232.0.0/16";

// create disk Object
const disk = new DiskModel();
disk.name = "newDisk";
disk.size = 10;
disk.mountpoint = "/newDisk";

// create vm node Object
const vm = new MachineModel();
vm.name = "testvm";
vm.node_id = 4;
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
        "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQDWlguBuvfQikkRJZXkLPei7Scvo/OULUEvjWVR4tCZ5V85P2F4SsSghxpRGixCNc7pNtgvdwJegK06Tn7SkV2jYJ9kBJh8PA06CPSz1mnpco4cgktiWx/R8xBvLGlyO0BwUuD3/WFjrc6fzH9E7Bpkel/xTnacx14w1bZAC1R35hz7BaHu1WrXsfxEd0VH7gpMPoQ4+l+H38ULPTiC+JcOKJOqVafgcc0sU7otXbgCa1Frr4QE5bwiMYhOlsRfRv/hf08jYsVo+RUO3wD12ylLWR7a7sJDkBBwgir8SwAvtRlT6k9ew9cDMQ7H8iWNCOg2xqoTLpVag6RN9kGzA5LGL+qHEcBr6gd2taFEy9+mt+TWuKp6reUeJfTu9RD1UgB0HpcdgTHtoUTISW7Mz4KNkouci2DJFngDWrLRxRoz81ZwfI2hjFY0PYDzF471K7Nwwt3qKYF1Js9a6VO38tMxSU4mTO83bt+dUFozgpw2Y0KKJGHDwU66i2MvTPg3EGs= ayoub@ayoub-Inspiron-3576",
};

// create VMs Object
const vms = new MachinesModel();
vms.name = "monVMS";
vms.network = n;
vms.machines = [vm];
vms.metadata = "{'testVMs': true}";
vms.description = "test deploying VMs via ts grid3 client";

async function main() {
    // deploy vms
    const res = await grid3.machines.deploy(vms);
    console.log(JSON.stringify(res));

    // get the deployment
    const l = await grid3.machines.getObj(vms.name);
    console.log(JSON.stringify(l));

    // // delete
    // const m = new MachinesDeleteModel();
    // m.name = vms.name;
    // const d = await grid3.machines.delete(m);
    // console.log(d);
}

main();
