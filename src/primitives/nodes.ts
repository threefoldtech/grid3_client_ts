import { default as PrivateIp } from "private-ip";

import { TFClient } from "../clients/tf-grid/client";
import { send } from "../helpers/requests";
import { GridClient } from "../client";

class Nodes {
    graphqlURL: string;

    constructor() {
        this.graphqlURL = GridClient.config.graphqlURL;
    }

    async getNodeTwinId(node_id: number): Promise<number> {
        const headers = { "Content-Type": "application/json" };
        const body = `{
            nodes(where: { nodeId_eq: ${node_id} }) {
            twinId
            }
        }`;
        const response = await send("post", this.graphqlURL, JSON.stringify({ query: body }), headers);
        return response["data"]["nodes"][0]["twinId"];
    }

    async getAccessNodes(): Promise<Record<string, unknown>> {
        const headers = { "Content-Type": "application/json" };
        const body = `{
        nodes {
          nodeId
          publicConfig{
              ipv4
              ipv6
              domain
          }
        }
      }`;
        const nodeResponse = await send("post", this.graphqlURL, JSON.stringify({ query: body }), headers);
        const nodes = nodeResponse["data"]["nodes"];
        const accessNodes = {};
        for (const node of nodes as Record<string, unknown>[]) {
            if (!node.publicConfig) {
                continue;
            }
            const ipv4 = node.publicConfig["ipv4"];
            const ipv6 = node.publicConfig["ipv4"];
            if (PrivateIp(ipv4.split("/")[0]) === false || PrivateIp(ipv6.split("/")[0]) === false) {
                accessNodes[+node.nodeId] = { ipv4: ipv4, ipv6: ipv6 };
            }
        }
        if (accessNodes === {}) {
            throw Error("Couldn't find any node with public config");
        }
        console.log(accessNodes);
        return accessNodes;
    }

    async getNodeIdFromContractId(contractId: number, mnemonic: string): Promise<number> {
        const tfclient = new TFClient(GridClient.config.substrateURL, mnemonic, GridClient.config.storeSecret, GridClient.config.keypairType);
        const contract = await tfclient.contracts.get(contractId);
        return contract["contract_type"]["nodeContract"]["node_id"];
    }
}
export { Nodes };
