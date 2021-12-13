import "reflect-metadata";

import { GridClient } from "../src/client";
import { log } from "./utils";
import { NetworkModel, MachineModel, MachinesModel, DiskModel, MachinesDeleteModel } from "../src/modules/models";
import { Nodes, FilterOptions } from "../src/primitives";
import { config, getClient } from "./client_loader";

async function main() {
    const grid3 = await getClient();
    const nodes = new Nodes(GridClient.config.graphqlURL, GridClient.config.rmbClient["proxyURL"]);

    // create network Object
    const n = new NetworkModel();
    n.name = "dynamictest";
    n.ip_range = "10.249.0.0/16";

    // create disk Object
    const disk = new DiskModel();
    disk.name = "dynamicDisk";
    disk.size = 8;
    disk.mountpoint = "/testdisk";

    const server1_options: FilterOptions = {
        cru: 1,
        mru: 2, // GB
        country: "Belgium",
    };

    // create vm node Object
    const vm = new MachineModel();
    vm.name = "testvm";
    try {
        vm.node_id = +(await nodes.filterNodes(server1_options))[0].nodeId; // TODO: allow random choise

    } catch (err) {
        console.log(err);
        process.exit(1);
    }
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
    vms.name = "dynamicVMS";
    vms.network = n;
    vms.machines = [vm];
    vms.metadata = "{'testVMs': true}";
    vms.description = "test deploying VMs via ts grid3 client";

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

}

main();
