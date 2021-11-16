import "reflect-metadata";

import { NetworkModel, MachineModel, MachinesModel, DiskModel, MachinesDeleteModel } from "../../src/modules/models";
import { getClient } from "../client_loader";

// create network Object
const n = new NetworkModel();
n.name = "fw_net";
n.ip_range = "10.249.0.0/16";

// create disk Object
const disk = new DiskModel();
disk.name = "fw_disk";
disk.size = 1;
disk.mountpoint = "/data";

// create vm node Object
const vm = new MachineModel();
vm.name = "fw_vm";
vm.node_id = 7;
vm.disks = [disk];
vm.public_ip = false;
vm.planetary = true;
vm.cpu = 1;
vm.memory = 1024 * 2;
vm.rootfs_size = 1;
vm.flist = "https://hub.grid.tf/omar0.3bot/omarelawady-funk-latest.flist";
vm.entrypoint = "/init.sh";
vm.env = {
    FUNKWHALE_HOSTNAME: "funkwhale.gent01.dev.grid.tf",
};

// create VMs Object
const vms = new MachinesModel();
vms.name = "fw";
vms.network = n;
vms.machines = [vm];
vms.metadata = "{'testVMs': true}";
vms.description = "test deploying VMs via ts grid3 client";

async function main() {
    const grid3 = await getClient();

    const cmd = process.argv[2];

    cmd === "deploy"
        ? await deploy(grid3)
        : cmd == "get"
        ? await get(grid3)
        : cmd == "getInfo"
        ? await getInfo(grid3)
        : cmd == "destroy"
        ? await destroy(grid3)
        : console.log("Enter a useful command");

    grid3.disconnect();
}

main();

async function deploy(grid3) {
    const res = await grid3.machines.deploy(vms);
    console.log(JSON.stringify(res));

    await get(grid3);
}

async function get(grid3) {
    const l = await grid3.machines.getObj(vms.name);
    console.log(JSON.stringify(l));
}

async function getInfo(grid3) {
    const l = await grid3.machines.get(vms);
    console.log(JSON.stringify(l));
}

async function destroy(grid3) {
    const m = new MachinesDeleteModel();
    m.name = vms.name;
    const d = await grid3.machines.delete(m);
    console.log(d);
}
