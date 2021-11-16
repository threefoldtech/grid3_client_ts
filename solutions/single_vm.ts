import "reflect-metadata";

import { NetworkModel, MachineModel, MachinesModel, DiskModel, MachinesDeleteModel } from "../src/modules/models";
import { getClient } from "./client_loader";

// create network Object
const n = new NetworkModel();
n.name = "anet";
n.ip_range = "10.249.0.0/16";

// create disk Object
const disk = new DiskModel();
disk.name = "adisk";
disk.size = 8;
disk.mountpoint = "/data";

// create vm node Object
const vm = new MachineModel();
vm.name = "avm";
vm.node_id = 7;
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
        "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQC5YT0rldH+4dgbW3biKGiO1dElwVMW+5JH5kfsySgRXiaA9+v8Rj11Jihwv/YeP6U+xofjFFVt5MFpPJ4GCU13Hpn8OeSh6xPwe+9Yk+YKb2sIcoQs5k9tx7lIqkgrbrCurCVtGEJnBvVcqrjiH/xVkpl2aTEWROgByEcGYHJ5Z8p5B0ybxxcXHA2dvSBIOMzsYozFLVXLXSXPvPhA1noeVGWsU0TQAxyyo1iYHIXQGpJ6AGohM24h06dV3r7kXpptCVyggIWP8+p/tBgumoL/B4AinrofgTnovbUDIANbzxhcPP4JO/UJL/KACBgVtoRTw2YvLkQ1t5tWRdIOAwWBkUo/EETDxmG1kPXybTZkrmBjtSOiCQCAxZis6dX4qyzCeY+ORICBvrDx6bnrG1kWo7Qnfblp6SeSKV+HOGtyy7IDEB9WUq7SNxIYpvVRqzqLxDixx/SzeouEcjB4oD4Kkty3OliqRRbp9VQ+bF2bqwF9UdGf6nx21q5HOEmzwgc= omar@jarvis",
};

// create VMs Object
const vms = new MachinesModel();
vms.name = "official_base";
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
