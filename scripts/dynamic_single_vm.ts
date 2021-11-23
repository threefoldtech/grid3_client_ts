import "reflect-metadata";

import { GridClient } from "../src/client";
import { log } from "./utils";
import { NetworkModel, MachineModel, MachinesModel, DiskModel, MachinesDeleteModel } from "../src/modules/models";
import { Nodes, FilterOptions } from "../src/primitives";
import { getClient } from "./client_loader";

async function main() {
    const grid3 = await getClient();
    const nodes = new Nodes(GridClient.config.graphqlURL, GridClient.config.rmbClient["proxyURL"]);

    // create network Object
    const n = new NetworkModel();
    n.name = "wedtest";
    n.ip_range = "10.249.0.0/16";

    // create disk Object
    const disk = new DiskModel();
    disk.name = "wedDisk";
    disk.size = 8;
    disk.mountpoint = "/testdisk";

    const server1_options: FilterOptions = {
        cru: 1,
        mru: 1, // GB
        country: "BE",
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
        SSH_KEY:
            "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQDWlguBuvfQikkRJZXkLPei7Scvo/OULUEvjWVR4tCZ5V85P2F4SsSghxpRGixCNc7pNtgvdwJegK06Tn7SkV2jYJ9kBJh8PA06CPSz1mnpco4cgktiWx/R8xBvLGlyO0BwUuD3/WFjrc6fzH9E7Bpkel/xTnacx14w1bZAC1R35hz7BaHu1WrXsfxEd0VH7gpMPoQ4+l+H38ULPTiC+JcOKJOqVafgcc0sU7otXbgCa1Frr4QE5bwiMYhOlsRfRv/hf08jYsVo+RUO3wD12ylLWR7a7sJDkBBwgir8SwAvtRlT6k9ew9cDMQ7H8iWNCOg2xqoTLpVag6RN9kGzA5LGL+qHEcBr6gd2taFEy9+mt+TWuKp6reUeJfTu9RD1UgB0HpcdgTHtoUTISW7Mz4KNkouci2DJFngDWrLRxRoz81ZwfI2hjFY0PYDzF471K7Nwwt3qKYF1Js9a6VO38tMxSU4mTO83bt+dUFozgpw2Y0KKJGHDwU66i2MvTPg3EGs= ayoub@ayoub-Inspiron-3576",
    };

    // create VMs Object
    const vms = new MachinesModel();
    vms.name = "newVMS";
    vms.network = n;
    vms.machines = [vm];
    vms.metadata = "{'testVMs': true}";
    vms.description = "test deploying VMs via ts grid3 client";

    // deploy vms
    grid3.machines.deploy(vms)
        .then(res => {
            log(res);
            // get the deployment
            grid3.machines.getObj(vms.name)
                .then(res_l => {
                    log(res_l);
                })
                .catch(err => {
                    console.log(err);
                    process.exit(1);
                })
                .finally(() => {
                    grid3.disconnect();
                })
        })
        .catch(err => {
            grid3.disconnect();
            console.log(err);
            process.exit(1);
        })

    // // delete
    // const d = await grid3.machines.delete({ name: vms.name });
    // log(d);

}

main();
