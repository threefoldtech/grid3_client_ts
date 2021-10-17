// import { NetworkModel, MachineModel, MachinesModel, DiskModel, MachinesDeleteModel } from "../dist/node/modules/models";
// import { MachineModule } from "../dist/node/modules/machine";
// import { HTTPMessageBusClient } from "ts-rmb-http-client";
// import { TWIN_ID, MNEMONICS, TFCHAIN_URL } from "./env";
// if (!(TWIN_ID || MNEMONICS || TFCHAIN_URL)) {
//     throw Error("Can not find MNEMONICS or Twin_ID in the environment variables");
// }
// const rmb = new HTTPMessageBusClient(3, "https://rmbproxy1.devnet.grid.tf");
// const vmsDeployment = new MachineModule(~~TWIN_ID, TFCHAIN_URL, MNEMONICS, rmb);
// function get(name: string) {
//     return vmsDeployment.getPrettyObj(name);
// }
// function listDeploymentNames(): string[] {
//     return vmsDeployment.list();
// }
// function listAll() {
//     return listDeploymentNames().map(d => ({ d: get(d) }));
// }
// async function remove(vmsDeployment, name: string) {
//     // delete the deployment
//     const m = new MachinesDeleteModel();
//     m.name = name;
//     const d = await vmsDeployment.delete(m);
//     console.log(d);
// }
// async function deploy() {
//     // create network Object
//     const n = new NetworkModel();
//     n.name = "wedNetwork";
//     n.ip_range = "10.244.0.0/16";
//     // create disk Object
//     const disk = new DiskModel();
//     disk.name = "newDisk";
//     disk.size = 10;
//     disk.mountpoint = "/newDisk";
//     // create vm node Object
//     const vm1 = new MachineModel();
//     vm1.name = "testvm";
//     vm1.node_id = 2;
//     vm1.disks = [disk];
//     vm1.public_ip = false;
//     vm1.planetary = true;
//     vm1.cpu = 1;
//     vm1.memory = 1024 * 2;
//     vm1.rootfs_size = 1;
//     vm1.flist = "https://hub.grid.tf/tf-official-apps/base:latest.flist";
//     vm1.entrypoint = "/sbin/zinit init";
//     vm1.env = {
//         SSH_KEY:
//             "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQDWlguBuvfQikkRJZXkLPei7Scvo/OULUEvjWVR4tCZ5V85P2F4SsSghxpRGixCNc7pNtgvdwJegK06Tn7SkV2jYJ9kBJh8PA06CPSz1mnpco4cgktiWx/R8xBvLGlyO0BwUuD3/WFjrc6fzH9E7Bpkel/xTnacx14w1bZAC1R35hz7BaHu1WrXsfxEd0VH7gpMPoQ4+l+H38ULPTiC+JcOKJOqVafgcc0sU7otXbgCa1Frr4QE5bwiMYhOlsRfRv/hf08jYsVo+RUO3wD12ylLWR7a7sJDkBBwgir8SwAvtRlT6k9ew9cDMQ7H8iWNCOg2xqoTLpVag6RN9kGzA5LGL+qHEcBr6gd2taFEy9+mt+TWuKp6reUeJfTu9RD1UgB0HpcdgTHtoUTISW7Mz4KNkouci2DJFngDWrLRxRoz81ZwfI2hjFY0PYDzF471K7Nwwt3qKYF1Js9a6VO38tMxSU4mTO83bt+dUFozgpw2Y0KKJGHDwU66i2MvTPg3EGs= ayoub@ayoub-Inspiron-3576",
//     };
//     // create vm node Object
//     const vm2 = new MachineModel();
//     vm2.name = "testvm";
//     vm2.node_id = 4;
//     vm2.disks = [disk];
//     vm2.public_ip = false;
//     vm2.planetary = true;
//     vm2.cpu = 1;
//     vm2.memory = 1024 * 2;
//     vm2.rootfs_size = 1;
//     vm2.flist = "https://hub.grid.tf/tf-official-apps/base:latest.flist";
//     vm2.entrypoint = "/sbin/zinit init";
//     vm2.env = {
//         SSH_KEY:
//             "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQDWlguBuvfQikkRJZXkLPei7Scvo/OULUEvjWVR4tCZ5V85P2F4SsSghxpRGixCNc7pNtgvdwJegK06Tn7SkV2jYJ9kBJh8PA06CPSz1mnpco4cgktiWx/R8xBvLGlyO0BwUuD3/WFjrc6fzH9E7Bpkel/xTnacx14w1bZAC1R35hz7BaHu1WrXsfxEd0VH7gpMPoQ4+l+H38ULPTiC+JcOKJOqVafgcc0sU7otXbgCa1Frr4QE5bwiMYhOlsRfRv/hf08jYsVo+RUO3wD12ylLWR7a7sJDkBBwgir8SwAvtRlT6k9ew9cDMQ7H8iWNCOg2xqoTLpVag6RN9kGzA5LGL+qHEcBr6gd2taFEy9+mt+TWuKp6reUeJfTu9RD1UgB0HpcdgTHtoUTISW7Mz4KNkouci2DJFngDWrLRxRoz81ZwfI2hjFY0PYDzF471K7Nwwt3qKYF1Js9a6VO38tMxSU4mTO83bt+dUFozgpw2Y0KKJGHDwU66i2MvTPg3EGs= ayoub@ayoub-Inspiron-3576",
//     };
//     // create VMs Object
//     const vms = new MachinesModel();
//     vms.name = "wedVMS";
//     vms.network = n;
//     vms.machines = [vm1, vm2];
//     vms.metadata = "{'testVMs': true}";
//     vms.description = "test deploying VMs via ts grid3 client";
//     // deploy vm
//     const res = await vmsDeployment.deploy(vms);
//     console.log(JSON.stringify(res));
//     // get the deployment
//     const l = await vmsDeployment.getPrettyObj(vms.name);
//     console.log(JSON.stringify(l));
// }
// function main() {
//     deploy();
//     listAll();
// }
// main();
