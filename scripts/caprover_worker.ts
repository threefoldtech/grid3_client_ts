import "reflect-metadata";

import { log } from "./utils";
import { NetworkModel, MachineModel, MachinesModel, DiskModel } from "../src/modules/models";
import { getClient } from "./client_loader";
// import {generateString} from "../src/helpers/utils";

const CAPROVER_FLIST = "https://hub.grid.tf/samehabouelsaad.3bot/abouelsaad-caprover-tf_10.0.1_v1.0.flist";
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
vm.node_id = 17;
vm.disks = [disk];
vm.public_ip = true;
vm.planetary = false;
vm.cpu = 4;
vm.memory = 1024 * 4;
vm.rootfs_size = 10;
vm.flist = CAPROVER_FLIST;
vm.entrypoint = "/sbin/zinit init";
vm.env = {
    PUBLIC_KEY:
        "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQCZ2f0jzr1xl54nWtSFZmyYTTiEjYHH/SkHI5fEvPHzQGzUeh7sP2z0mwGLcr5u/Y/hhKLfo4nULIPs9hZiLN5zZCUR9kCqZVr5mL+rTbmWyHVGsY4ozEZdxpi+pcVfLpyD3KTEnCVBMcB9SKHVcCMDL0NkVzxbf7rn/zvqCNOvvk75ofh9s29GvMtykkep6I+3jCvwRGJN4+ZVne0dz2fLFasZ/q/RPAKX+JQdTaP2yL4GKpFPtmo4iFLxSvMZTzSi887VsjukxMFQ/Plv+5c1rdI6nhDQM8kWQxs6UkM5FBqqAwxMra8V2HXqtG3KyCRdIyzrjbEeaGZilNLVv108Oq82/JhJLfWQcE6WmPfjm5gAMuiZYAjyNOFaCV42q3bZqtbqjlMz+qcU4tzlla5MMx7Kj4TILYZqhmzYsX7Xb/CnGS2XqhlKMZrpHY12V00wVWH+lWKi1JWIR7cyhri89VUhftTyUUeYEyTL9/8HoiSeqtjPIsxrkGyybT6b2S8= rafy@rafy-Inspiron-3576",
    SWM_NODE_MODE: "worker",
    SWMTKN: "SWMTKN-1-0892ds1ney7pa0hymi3qwph7why1d9r3z6bvwtin51r14hcz3t-cjsephnu4f2ezfpdd6svnnbq7",
    LEADER_PUBLIC_IP: "185.206.122.44",
};

// create VMs Object
const vms = new MachinesModel();
vms.name = "newVMS5";
vms.network = n;
vms.machines = [vm];
vms.metadata = "{'testVMs': true}";
vms.description = "caprover worker machine/node";

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
    } catch (err) {
        console.log(err);
        process.exit(1);
    } finally {
        grid3.disconnect();
    }
}

main();
