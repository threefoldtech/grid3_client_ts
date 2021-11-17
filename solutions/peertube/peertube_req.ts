import "reflect-metadata";

import { NetworkModel, MachineModel, MachinesModel, DiskModel, MachinesDeleteModel } from "../../src/modules/models";
import { getClient } from "../client_loader";

const n = new NetworkModel();
n.name = "peertube_net";
n.ip_range = "10.1.0.0/16";

const disk1 = new DiskModel();
disk1.name = "redis_data";
disk1.size = 10;
disk1.mountpoint = "/data";

const vm1 = new MachineModel();
vm1.name = "redis3";
vm1.node_id = 7;
vm1.disks = [disk1];
vm1.public_ip = false;
vm1.planetary = true;
vm1.cpu = 1;
vm1.memory = 265;
vm1.rootfs_size = 1;
vm1.flist = "https://hub.grid.tf/omar0.3bot/omarelawady-redis-grid3.flist";
vm1.entrypoint = "/start.sh";
vm1.env = {
    PASSWORD: "omar123456",
};

const disk2 = new DiskModel();
disk2.name = "postgres_data";
disk2.size = 10;
disk2.mountpoint = "/var/lib/postgresql/data";

const vm2 = new MachineModel();
vm2.name = "postgres3";
vm2.node_id = 7;
vm2.disks = [disk2];
vm2.public_ip = false;
vm2.planetary = true;
vm2.cpu = 1;
vm2.memory = 265;
vm2.rootfs_size = 1;
vm2.flist = "https://hub.grid.tf/omar0.3bot/omarelawady-postgres-grid3.flist";
vm2.entrypoint = "/start.sh";
vm2.env = {
    POSTGRES_PASSWORD: "omar123456",
    POSTGRES_DB: "peertube_prod",
    PGDATA: "/var/lib/postgresql/data",
};

const vms = new MachinesModel();
vms.name = "peertube_req3";
vms.network = n;
vms.machines = [vm1, vm2];
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
