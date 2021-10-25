// import { K8sModule } from "../dist/node/modules/k8s";

// import { HTTPMessageBusClient } from "ts-rmb-http-client";

// const rmb = new HTTPMessageBusClient(3, "https://rmbproxy1.devnet.grid.tf");
// const k8sDeployment = new K8sModule(
//     3,
//     "wss://tfchain.dev.threefold.io",
//     "muffin reward plug grant able market nerve orphan token foster major relax",
//     rmb,
// );

// function get(name: string) {
//     return k8sDeployment.getPrettyObj(name);
// }

// function listDeploymentNames(): string[] {
//     return k8sDeployment.list();
// }

// function listAll() {
//     return listDeploymentNames().map(d => ({ d: get(d) }));
// }

// async function remove(name: string) {
//     // delete the deployment
//     const kdel = new K8SDeleteModel();
//     kdel.name = name;
//     const d = await k8sDeployment.delete(kdel);
//     console.log(d);
// }

// async function deploy() {
//     // create network Object
//     const n = new NetworkModel();
//     n.name = "newNetwork";
//     n.ip_range = "10.241.0.0/16";

//     // create k8s node Object
//     const master = new KubernetesNodeModel();
//     master.name = "master";
//     master.node_id = 4;
//     master.cpu = 1;
//     master.memory = 1024 * 2;
//     master.rootfs_size = 1;
//     master.disk_size = 8;
//     master.public_ip = false;
//     master.planetary = true;

//     // create k8s node Object
//     const worker = new KubernetesNodeModel();
//     worker.name = "worker";
//     worker.node_id = 4;
//     worker.cpu = 2;
//     worker.memory = 1024 * 4;
//     worker.rootfs_size = 1;
//     worker.disk_size = 8;
//     worker.public_ip = false;
//     worker.planetary = true;

//     // create k8s Object
//     const k = new K8SModel();
//     k.name = "testk8s";
//     k.secret = "secret";
//     k.network = n;
//     k.masters = [master];
//     k.workers = [worker];
//     k.metadata = "{'testk8s': true}";
//     k.description = "test deploying k8s via ts grid3 client";
//     k.ssh_key =
//         "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQDWlguBuvfQikkRJZXkLPei7Scvo/OULUEvjWVR4tCZ5V85P2F4SsSghxpRGixCNc7pNtgvdwJegK06Tn7SkV2jYJ9kBJh8PA06CPSz1mnpco4cgktiWx/R8xBvLGlyO0BwUuD3/WFjrc6fzH9E7Bpkel/xTnacx14w1bZAC1R35hz7BaHu1WrXsfxEd0VH7gpMPoQ4+l+H38ULPTiC+JcOKJOqVafgcc0sU7otXbgCa1Frr4QE5bwiMYhOlsRfRv/hf08jYsVo+RUO3wD12ylLWR7a7sJDkBBwgir8SwAvtRlT6k9ew9cDMQ7H8iWNCOg2xqoTLpVag6RN9kGzA5LGL+qHEcBr6gd2taFEy9+mt+TWuKp6reUeJfTu9RD1UgB0HpcdgTHtoUTISW7Mz4KNkouci2DJFngDWrLRxRoz81ZwfI2hjFY0PYDzF471K7Nwwt3qKYF1Js9a6VO38tMxSU4mTO83bt+dUFozgpw2Y0KKJGHDwU66i2MvTPg3EGs= ayoub@ayoub-Inspiron-3576";

//     // deploy k8s
//     const res = await k8sDeployment.deploy(k);
//     console.log(JSON.stringify(res));

//     // get the deployment
//     const l = await k8sDeployment.getPrettyObj(k.name);
//     console.log(l);
// }

// function main() {
//     // deploy();
//     listAll();
// }

// main();

import "reflect-metadata";

import { NetworkModel, K8SModel, KubernetesNodeModel, K8SDeleteModel } from "../dist/node/modules/models";
import { getClient } from "./base";

const grid3 = getClient();

// create network Object
const n = new NetworkModel();
n.name = "monNetwork";
n.ip_range = "10.238.0.0/16";

// create k8s node Object
const master = new KubernetesNodeModel();
master.name = "master";
master.node_id = 4;
master.cpu = 1;
master.memory = 1024 * 2;
master.rootfs_size = 1;
master.disk_size = 8;
master.public_ip = false;
master.planetary = true;

// create k8s node Object
const worker = new KubernetesNodeModel();
worker.name = "worker";
worker.node_id = 4;
worker.cpu = 2;
worker.memory = 1024 * 4;
worker.rootfs_size = 1;
worker.disk_size = 8;
worker.public_ip = false;
worker.planetary = true;

// create k8s Object
const k = new K8SModel();
k.name = "testk8s";
k.secret = "secret";
k.network = n;
k.masters = [master];
k.workers = [worker];
k.metadata = "{'testk8s': true}";
k.description = "test deploying k8s via ts grid3 client";
k.ssh_key =
    "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQDWlguBuvfQikkRJZXkLPei7Scvo/OULUEvjWVR4tCZ5V85P2F4SsSghxpRGixCNc7pNtgvdwJegK06Tn7SkV2jYJ9kBJh8PA06CPSz1mnpco4cgktiWx/R8xBvLGlyO0BwUuD3/WFjrc6fzH9E7Bpkel/xTnacx14w1bZAC1R35hz7BaHu1WrXsfxEd0VH7gpMPoQ4+l+H38ULPTiC+JcOKJOqVafgcc0sU7otXbgCa1Frr4QE5bwiMYhOlsRfRv/hf08jYsVo+RUO3wD12ylLWR7a7sJDkBBwgir8SwAvtRlT6k9ew9cDMQ7H8iWNCOg2xqoTLpVag6RN9kGzA5LGL+qHEcBr6gd2taFEy9+mt+TWuKp6reUeJfTu9RD1UgB0HpcdgTHtoUTISW7Mz4KNkouci2DJFngDWrLRxRoz81ZwfI2hjFY0PYDzF471K7Nwwt3qKYF1Js9a6VO38tMxSU4mTO83bt+dUFozgpw2Y0KKJGHDwU66i2MvTPg3EGs= ayoub@ayoub-Inspiron-3576";

async function main() {
    // deploy k8s
    const res = await grid3.k8s.deploy(k);
    console.log(res);

    // get the deployment
    const l = await grid3.k8s.getObj(k.name);
    console.log(l);

    // // delete
    // const m = new K8SDeleteModel();
    // m.name = k.name;
    // const d = await grid3.k8s.delete(m);
    // console.log(d);
}

main();
