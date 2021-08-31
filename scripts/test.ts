import { Znet, Peer } from "../src/zos/znet";
import { Zmount } from "../src/zos/zmount";
import { Zmachine, ZmachineNetwork, ZNetworkInterface, Mount } from "../src/zos/zmachine";
import { ComputeCapacity } from "../src/zos/computecapacity";
import { Workload, WorkloadTypes } from "../src/zos/workload";
import { Deployment, SignatureRequirement, SignatureRequest } from "../src/zos/deployment";
import { TFClient } from "../src/tf-grid/client"
import { MessageBusClient } from "../src/rmb/client"

async function main() {
    const twin_id = 10
    const mnemonic = "false boss tape wish talent pool ghost token exhibit response hedgehog invite";
    const url = "wss://explorer.devnet.grid.tf/ws"
    const node_id = 2;
    const node_twin_id = 3;
    const ssh_key = "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQDmm8OzLt+lTdGaMUwMFcw0P+vr+a/h/UsR//EzzeQsgNtC0bdls4MawVEhb3hNcycEQNd2P/+tXdLC4qcaJ6iABYip4xqqAeY098owGDYhUKYwmnMyo+NwSgpjZs8taOhMxh5XHRI+Ifr4l/GmzbqExS0KVD21PI+4sdiLspbcnVBlg9Eg9enM///zx6rSkulrca/+MnSYHboC5+y4XLYboArD/gpWy3zwIUyxX/1MjJwPeSnd5LFBIWvPGrm3cl+dAtADwTZRkt5Yuet8y5HI73Q5/NSlCdYXMtlsKBLpJu3Ar8nz1QfSQL7dB8pa7/sf/s8wO17rXqWQgZG6JzvZ root@ahmed-Inspiron-3576"
    const contract_id = 18; // used only in case of updating deployment.

    // Create zmount workload
    let zmount = new Zmount();
    zmount.size = 1024 * 1024 * 1024 * 10;

    let zmount_workload = new Workload()
    zmount_workload.version = 0
    zmount_workload.name = "zmountiaia"
    zmount_workload.type = WorkloadTypes.zmount
    zmount_workload.data = zmount
    zmount_workload.metadata = "zm"
    zmount_workload.description = "zm test"

    // Create znet workload
    let peer = new Peer();
    peer.subnet = "10.240.2.0/24";
    peer.wireguard_public_key = "cEzVprB7IdpLaWZqYOsCndGJ5MBgv1q1lTFG1B2Czkc=";
    peer.allowed_ips = ["10.240.2.0/24", "100.64.240.2/32"];


    let znet = new Znet();
    znet.subnet = "10.240.1.0/24";
    znet.ip_range = "10.240.0.0/16";
    znet.wireguard_private_key = "SDtQFBHzYTu/c7dt/X1VDZeGmXmE7TD6nQC5tp4wv38=";
    znet.wireguard_listen_port = 7821;
    znet.peers = [peer];


    let znet_workload = new Workload();
    znet_workload.version = 0;
    znet_workload.name = "testznetwork";
    znet_workload.type = WorkloadTypes.network;
    znet_workload.data = znet;
    znet_workload.metadata = "zn"
    znet_workload.description = "zn test"

    // create zmachine workload
    let mount = new Mount();
    mount.name = "zmountiaia";
    mount.mountpoint = "/mydisk";

    let znetwork_interface = new ZNetworkInterface();
    znetwork_interface.network = "testznetwork";
    znetwork_interface.ip = "10.240.1.5";

    let zmachine_network = new ZmachineNetwork();
    zmachine_network.planetary = true;
    zmachine_network.interfaces = [znetwork_interface]

    let compute_capacity = new ComputeCapacity();
    compute_capacity.cpu = 1;
    compute_capacity.memory = 1024 * 1024 * 1024 * 2;

    let zmachine = new Zmachine();
    zmachine.flist = "https://hub.grid.tf/tf-official-apps/base:latest.flist";
    zmachine.network = zmachine_network;
    zmachine.size = 1;
    zmachine.mounts = [mount];
    zmachine.entrypoint = "/sbin/zinit init";
    zmachine.compute_capacity = compute_capacity;
    zmachine.env = { "SSH_KEY": ssh_key };

    let zmachine_workload = new Workload();
    zmachine_workload.version = 0;
    zmachine_workload.name = "testzmachine";
    zmachine_workload.type = WorkloadTypes.zmachine;
    zmachine_workload.data = zmachine;
    zmachine_workload.metadata = "zmachine";
    zmachine_workload.description = "zmachine test"


    // Create deployment
    let signature_request = new SignatureRequest();
    signature_request.twin_id = twin_id;
    signature_request.weight = 1;

    let signature_requirement = new SignatureRequirement();
    signature_requirement.weight_required = 1;
    signature_requirement.requests = [signature_request];

    let deployment = new Deployment()
    deployment.version = 0;
    deployment.twin_id = twin_id;
    deployment.expiration = 1626394539;
    deployment.metadata = "zm dep";
    deployment.description = "zm test"
    deployment.workloads = [zmount_workload, znet_workload, zmachine_workload];
    deployment.signature_requirement = signature_requirement;

    console.log(deployment.challenge_hash())
    console.log(deployment.challenge())
    deployment.sign(twin_id, mnemonic)


    const tf_client = new TFClient(url, mnemonic);
    await tf_client.connect();

    async function deploy() {
        const contract = await tf_client.contracts.create(node_id, deployment.challenge_hash(), "", 0);
        console.log(contract)
        deployment.contract_id = contract["contract_id"];
        let payload = JSON.stringify(deployment);
        console.log("payload>>>>>>>>>>>>>>>>>>", payload)

        let rmb = new MessageBusClient();
        let msg = rmb.prepare("zos.deployment.deploy", [node_twin_id], 0, 2);
        rmb.send(msg, payload)
        const result = await rmb.read(msg)
        console.log(result)
    }


    async function update() {
        await tf_client.contracts.update(contract_id, "", deployment.challenge_hash())
        deployment.contract_id = contract_id;
        let payload = JSON.stringify(deployment);
        console.log("payload>>>>>>>>>>>>>>>>>>", payload)

        let rmb = new MessageBusClient(6379);
        let msg = rmb.prepare("zos.deployment.update", [node_twin_id], 0, 2);
        rmb.send(msg, payload)
        const result = await rmb.read(msg)
        console.log(result)
    }
    await deploy();
    tf_client.disconnect()
    // await update();
}

main()
