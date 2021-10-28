import { default as PrivateIp } from "private-ip";
import { default as urlParser } from "url-parse";
import { default as urlJoin } from "url-join";

import { TFClient } from "../tf-grid/client";

import { send } from "../helpers/requests";

class Nodes {
    graphqlURL: string;

    constructor(public url: string) {
        const chainURLParsed = urlParser(url);
        this.graphqlURL = urlJoin("https://", chainURLParsed.hostname, "graphql/graphql");
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
        let body = `{
        nodes {
          nodeId
          publicConfigId 
        }
      }`;
        const nodeResponse = await send("post", this.graphqlURL, JSON.stringify({ query: body }), headers);
        const nodes = nodeResponse["data"]["nodes"];
        const nodeConfigs = {};
        let configsIds = "";
        for (const node of nodes) {
            if (!node.publicConfigId) {
                continue;
            }
            nodeConfigs[node.nodeId] = node.publicConfigId;
            configsIds += `"${node.publicConfigId}", `;
        }
        body = `{
        publicConfigs (where: {id_in: [${configsIds}]}) {
          id
          ipv4
          ipv6
          domain
        }
      }`;
        const pubConfigResponse = await send("post", this.graphqlURL, JSON.stringify({ query: body }), headers);
        const configs = pubConfigResponse["data"]["publicConfigs"];

        const accessNodes = {};
        for (const nodeId of Object.keys(nodeConfigs)) {
            const config = nodeConfigs[nodeId];
            for (const conf of configs) {
                if (config === conf["id"]) {
                    const ipv4 = conf["ipv4"];
                    const ipv6 = conf["ipv6"];
                    if (PrivateIp(ipv4.split("/")[0]) === false || PrivateIp(ipv6.split("/")[0]) === false) {
                        accessNodes[nodeId] = { ipv4: ipv4, ipv6: ipv6 };
                    }
                }
            }
        }
        console.log(accessNodes);
        return accessNodes;
    }

    async getNodeIdFromContractId(contractId: number, mnemonic: string): Promise<number> {
        const tfclient = new TFClient(this.url, mnemonic);
        let nodeId;
        try {
            await tfclient.connect();
            const contract = await tfclient.contracts.get(contractId);
            nodeId = contract["contract_type"]["nodeContract"]["node_id"];
        } catch (err) {
            throw Error(err);
        } finally {
            tfclient.disconnect();
        }
        return nodeId;
    }
}
export { Nodes };
