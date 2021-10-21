var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { default as IP } from "ip";
import { default as urlParser } from "url-parse";
import { default as urlJoin } from "url-join";
import { TFClient } from "../tf-grid/client";
import { send } from "../helpers/requests";
class Nodes {
    constructor(url) {
        this.url = url;
        const chainURLParsed = urlParser(url);
        this.graphqlURL = urlJoin("https://", chainURLParsed.hostname, "graphql/graphql");
    }
    getNodeTwinId(node_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const headers = { "Content-Type": "application/json" };
            const body = `{
            nodes(where: { nodeId_eq: ${node_id} }) {
            twinId
            }
        }`;
            const response = yield send("post", this.graphqlURL, JSON.stringify({ query: body }), headers);
            return response["data"]["nodes"][0]["twinId"];
        });
    }
    getAccessNodes() {
        return __awaiter(this, void 0, void 0, function* () {
            const headers = { "Content-Type": "application/json" };
            let body = `{
        nodes {
          nodeId
          publicConfigId 
        }
      }`;
            const nodeResponse = yield send("post", this.graphqlURL, JSON.stringify({ query: body }), headers);
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
            const pubConfigResponse = yield send("post", this.graphqlURL, JSON.stringify({ query: body }), headers);
            const configs = pubConfigResponse["data"]["publicConfigs"];
            const accessNodes = {};
            for (const nodeId of Object.keys(nodeConfigs)) {
                const config = nodeConfigs[nodeId];
                for (const conf of configs) {
                    if (config === conf["id"]) {
                        const ipv4 = conf["ipv4"];
                        const ipv6 = conf["ipv6"];
                        if ((IP.isV4Format(ipv4.split("/")[0]) && !IP.isPrivate(ipv4.split("/")[0])) ||
                            (IP.isV6Format(ipv6.split("/")[0]) && !IP.isPrivate(ipv6.split("/")[0]))) {
                            accessNodes[nodeId] = { ipv4: ipv4, ipv6: ipv6 };
                        }
                    }
                }
            }
            console.log(accessNodes);
            return accessNodes;
        });
    }
    getNodeIdFromContractId(contractId, mnemonic) {
        return __awaiter(this, void 0, void 0, function* () {
            const tfclient = new TFClient(this.url, mnemonic);
            yield tfclient.connect();
            let nodeId;
            try {
                const contract = yield tfclient.contracts.get(contractId);
                nodeId = contract["contract_type"]["nodeContract"]["node_id"];
            }
            catch (err) {
                throw Error(err);
            }
            finally {
                tfclient.disconnect();
            }
            return nodeId;
        });
    }
}
export { Nodes };
