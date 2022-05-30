import { DiskModel, MachineModel, MachinesModel, NetworkModel } from "../src";
import { config, getClient } from "./client_loader";
import { log } from "./utils";

const CAPROVER_FLIST = "https://hub.grid.tf/tf-official-apps/tf-caprover-main.flist";
// create network Object
const n = new NetworkModel();
n.name = "wedtest";
n.ip_range = "10.249.0.0/16";

// create disk Object
const disk = new DiskModel();
disk.name = "wedDisk";
disk.size = 100;
disk.mountpoint = "/var/lib/docker";

// create vm node Object
const vm = new MachineModel();
vm.name = "testvm";
vm.node_id = 14;
vm.disks = [disk];
vm.public_ip = true;
vm.planetary = false;
vm.cpu = 4;
vm.memory = 1024 * 4;
vm.rootfs_size = 0;
vm.flist = CAPROVER_FLIST;
vm.entrypoint = "/sbin/zinit init";
vm.env = {
    PUBLIC_KEY: config.ssh_key,
    SWM_NODE_MODE: "leader",
    CAPROVER_ROOT_DOMAIN: "rafy.grid.tf", // update me
    DEFAULT_PASSWORD: "captain42",
    CAPTAIN_IMAGE_VERSION: "v1.2.1",
};

// create VMs Object
const vms = new MachinesModel();
vms.name = "newVMS5";
vms.network = n;
vms.machines = [vm];
vms.metadata = "{'testVMs': true}";
vms.description = "caprover leader machine/node";

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
