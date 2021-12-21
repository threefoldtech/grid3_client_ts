import { log } from "../../scripts/utils";
import { FilterOptions, generateString, GridClient, MachinesModel, randomChoice } from "../../src";
import { config, getClient } from "../client_loader";

jest.setTimeout(300000);

let gridClient: GridClient;

beforeAll(async () => {
    return (gridClient = await getClient());
});

test("Test001 creating a vm", async () => {
    const cpu = 1;
    const memory = 1024;
    const rootfsSize = 1;

    const nodes = await gridClient.capacity.filterNodes({ cru: cpu, mru: memory / 1024, sru: 1 } as FilterOptions);
    const nodeId = +randomChoice(nodes).nodeId;
    const vms: MachinesModel = {
        name: generateString(15),
        network: {
            name: generateString(15),
            ip_range: "10.249.0.0/16",
        },
        machines: [
            {
                name: generateString(15),
                node_id: nodeId,
                cpu: cpu,
                memory: memory,
                rootfs_size: rootfsSize,
                disks: [],
                flist: "https://hub.grid.tf/tf-official-apps/base:latest.flist",
                entrypoint: "/sbin/zinit init",
                public_ip: false,
                planetary: true,
                env: {
                    SSH_KEY: config.ssh_key,
                },
            },
        ],
        metadata: "{'deploymentType': 'vm'}",
        description: "test deploying VMs via ts grid3 client",
    };

    const res = await gridClient.machines.deploy(vms);
    log(res);
    expect(res.contracts.created.length).toBe(1);
});

afterEach(async () => {
    const vmNames = await gridClient.machines.list();
    for (const name of vmNames) {
        await gridClient.machines.delete({ name });
    }
});

afterAll(async () => {
    return await gridClient.disconnect();
});
