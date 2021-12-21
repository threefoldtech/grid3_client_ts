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
disk.mountpoint = "/testdisk"; //update this

// create vm node Object
const vm = new MachineModel();
vm.name = "capworker1";
vm.node_id = 14;
vm.disks = [disk];
vm.public_ip = true;
vm.planetary = false;
vm.cpu = 4;
vm.memory = 1024 * 4;
vm.rootfs_size = 10;
vm.flist = CAPROVER_FLIST;
vm.entrypoint = "/sbin/zinit init";
vm.env = {
    // These env. vars needed to be changed based on the leader node.
    PUBLIC_KEY: config.ssh_key,
    SWM_NODE_MODE: "worker",
    SWMTKN: "SWMTKN-1-1eikxeyat4br9t4la1dnln11l1tvlnrngzwh5iq68m2vn7edi1-6lc6xtw3pzd99lrowyuayr5yv",
    LEADER_PUBLIC_IP: "185.206.122.157",
};

// create VMs Object
const vms = new MachinesModel();
vms.name = "newVMS6";
vms.network = n;
vms.machines = [vm];
vms.metadata = "{'testVMs': true}";
vms.description = "caprover worker machine/node";

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
