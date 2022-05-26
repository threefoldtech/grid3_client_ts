import { FilterOptions, generateString, GridClient, MachinesModel, randomChoice } from "../../src";
import { config, getClient } from "../client_loader";
import { log } from "../utils";

jest.setTimeout(300000);

let gridClient: GridClient;

beforeAll(async () => {
    return (gridClient = await getClient());
});

test("Test001 creating a vm", async () => {
    const cpu = 1;
    const memory = 1024;
    const rootfsSize = 0;

    const nodes = await gridClient.capacity.filterNodes({
        cru: cpu,
        mru: memory / 1024,
        sru: 1,
        availableFor: await gridClient.twins.get_my_twin_id(),
    } as FilterOptions);
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
    expect(res.contracts.created).toHaveLength(1);
    expect(res.contracts.updated).toHaveLength(0);
    expect(res.contracts.deleted).toHaveLength(0);

    const vmsList = await gridClient.machines.list();
    log(vmsList);
    expect(vmsList.length).toBeGreaterThanOrEqual(1);
    expect(vmsList).toContain(vms.name);

    const result = await gridClient.machines.getObj(vms.name);
    log(result);
    expect(result[0].status).toBe("ok");
    expect(result[0].flist).toBe(vms.machines[0].flist);
    expect(result[0].capacity["cpu"]).toBe(cpu);
    expect(result[0].capacity["memory"]).toBe(memory);
    expect(result[0].planetary).toBeDefined();
    expect(result[0].publicIP).toBeNull();
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
