import "reflect-metadata";

import { log } from "./utils";
import { NetworkModel, MachineModel, MachinesModel, DiskModel, MachinesDeleteModel } from "../src/modules/models";
import { config, getClient } from "./client_loader";

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
    SSH_KEY: config.ssh_key,
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
    try {
        const res = await grid3.machines.deploy(vms);
        log(res);

        // get the deployment
        const l = await grid3.machines.getObj(vms.name);
        log(l);

        // // delete
        // const d = await grid3.machines.delete({ name: vms.name });
        // log(d);
    }
    catch (err) {
        console.log(err);
        process.exit(1);
    }
    finally {
        grid3.disconnect();
    }


};


main();
