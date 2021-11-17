import "reflect-metadata";

import { NetworkModel, MachineModel, MachinesModel, DiskModel, MachinesDeleteModel } from "../../src/modules/models";
import { getClient } from "../client_loader";

const n = new NetworkModel();
n.name = "peertube_net";
n.ip_range = "10.1.0.0/16";

const disk = new DiskModel();
disk.name = "peertube_data";
disk.size = 10;
disk.mountpoint = "/data";

const vm = new MachineModel();
vm.name = "peertubeVM3";
vm.node_id = 7;
vm.disks = [disk];
vm.public_ip = false;
vm.planetary = true;
vm.cpu = 3;
vm.memory = 1024 * 2;
vm.rootfs_size = 1;
vm.flist = "https://hub.grid.tf/omar0.3bot/omarelawady-peertube-grid3-tfconnect.flist";
vm.entrypoint = "/start.sh";
vm.env = {
    PEERTUBE_BIND_ADDRESS: "::",
    PEERTUBE_WEBSERVER_HOSTNAME: "peertube3.gent01.dev.grid.tf",
    PEERTUBE_DB_HOSTNAME: "10.1.4.3",
    PEERTUBE_DB_USERNAME: "postgres",
    PEERTUBE_DB_PASSWORD: "omar123456",
    PEERTUBE_REDIS_HOSTNAME: "10.1.4.2",
    PEERTUBE_REDIS_AUTH: "omar123456",
};

// create VMs Object
const vms = new MachinesModel();
vms.name = "peertube_vms3";
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
