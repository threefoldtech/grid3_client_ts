var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { default as PrivateIp } from "private-ip";
import { GridClient } from "../client";
import { Graphql } from "../clients/graphql/client";
import { TFClient } from "../clients/tf-grid/client";
import { send } from "../helpers/requests";
class Nodes {
    constructor(graphqlURL, proxyURL) {
        this.graphqlURL = graphqlURL;
        this.proxyURL = proxyURL;
        this.gqlClient = new Graphql(graphqlURL);
    }
    getNodeTwinId(node_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = `query getNodeTwinId($nodeId: Int!){
            nodes(where: { nodeID_eq: $nodeId }) {
            twinID
            }
        }`;
            const response = yield this.gqlClient.query(body, { nodeId: node_id });
            if (response["data"]["nodes"]["length"] === 0) {
                throw Error(`Couldn't find a node with id: ${node_id}`);
            }
            return response["data"]["nodes"][0]["twinID"];
        });
    }
    getAccessNodes() {
        return __awaiter(this, void 0, void 0, function* () {
            const accessNodes = {};
            const nodes = yield this.filterNodes({ accessNodeV4: true, accessNodeV6: true });
            for (const node of nodes) {
                const ipv4 = node.publicConfig.ipv4;
                const ipv6 = node.publicConfig.ipv6;
                const domain = node.publicConfig.domain;
                if (PrivateIp(ipv4.split("/")[0]) === false || PrivateIp(ipv6.split("/")[0]) === false) {
                    accessNodes[+node.nodeId] = { ipv4: ipv4, ipv6: ipv6, domain: domain };
                }
            }
            if (Object.keys(accessNodes).length === 0) {
                throw Error("Couldn't find any node with public config");
            }
            console.log(accessNodes);
            return accessNodes;
        });
    }
    getNodeIdFromContractId(contractId, mnemonic) {
        return __awaiter(this, void 0, void 0, function* () {
            const tfclient = new TFClient(GridClient.config.substrateURL, mnemonic, GridClient.config.storeSecret, GridClient.config.keypairType);
            const contract = yield tfclient.contracts.get(contractId);
            return contract["contract_type"]["nodeContract"]["node_id"];
        });
    }
    _g2b(GB) {
        return GB * Math.pow(1024, 3);
    }
    getFarms(page = 1, pageSize = 50, url = "") {
        return __awaiter(this, void 0, void 0, function* () {
            let r;
            if (url)
                r = url;
            else
                r = this.proxyURL;
            return send("get", `${r}/farms?page=${page}&size=${pageSize}`, "", {})
                .then(res => {
                return res;
            })
                .catch(err => {
                throw err;
            });
        });
    }
    getAllFarms(url = "") {
        return __awaiter(this, void 0, void 0, function* () {
            const farmsCount = yield this.gqlClient.getItemTotalCount("farms", "(orderBy: farmID_ASC)");
            return yield this.getFarms(1, farmsCount, url);
        });
    }
    checkFarmHasFreePublicIps(farmId, farms = null, url = "") {
        return __awaiter(this, void 0, void 0, function* () {
            if (!farms) {
                farms = yield this.getAllFarms(url);
            }
            return farms
                .filter(farm => farm.publicIps.filter(ip => ip.contractId === 0).length > 0)
                .map(farm => farm.farmId)
                .includes(farmId);
        });
    }
    getNodes(page = 1, pageSize = 50, url = "") {
        return __awaiter(this, void 0, void 0, function* () {
            let r;
            if (url)
                r = url;
            else
                r = this.proxyURL;
            const ret = yield send("get", `${r}/nodes?page=${page}&size=${pageSize}`, "", {});
            return ret;
        });
    }
    getAllNodes(url = "") {
        return __awaiter(this, void 0, void 0, function* () {
            const nodesCount = yield this.gqlClient.getItemTotalCount("nodes", "(orderBy: nodeID_ASC)");
            return yield this.getNodes(1, nodesCount, url);
        });
    }
    getNodesByFarmId(farmId, url = "") {
        return __awaiter(this, void 0, void 0, function* () {
            const nodesCount = yield this.gqlClient.getItemTotalCount("nodes", `(where: {farmId_eq: ${farmId}}, orderBy: nodeID_ASC)`);
            let r;
            if (url)
                r = url;
            else
                r = this.proxyURL;
            return send("get", `${r}/nodes?farm_id=${farmId}&size=${nodesCount}`, "", {})
                .then(res => {
                if (res)
                    return res;
                else
                    throw new Error(`The farm with id ${farmId}: doesn't have any nodes`);
            })
                .catch(err => {
                throw err;
            });
        });
    }
    getNodeFreeResources(nodeId, url = "") {
        return __awaiter(this, void 0, void 0, function* () {
            let r;
            if (url)
                r = url;
            else
                r = this.proxyURL;
            return send("get", `${r}/nodes/${nodeId}`, "", {})
                .then(res => {
                const node = res;
                const ret = { cru: 0, mru: 0, hru: 0, sru: 0, ipv4u: 0 };
                ret.cru = +node.capacity.total_resources.cru - +node.capacity.used_resources.cru;
                ret.mru = +node.capacity.total_resources.mru - +node.capacity.used_resources.mru;
                ret.sru = +node.capacity.total_resources.sru * 2 - +node.capacity.used_resources.sru; // over provisioning
                ret.hru = +node.capacity.total_resources.hru - +node.capacity.used_resources.hru;
                return ret;
            })
                .catch(err => {
                console.log(err);
                if (err.response.status === 404) {
                    throw Error(`Node: ${nodeId} is not found`);
                }
                else if (err.response.status === 502) {
                    throw Error(`Node: ${nodeId} is not reachable`);
                }
                else {
                    throw err;
                }
            });
        });
    }
    filterNodes(options = {}, url = "") {
        return __awaiter(this, void 0, void 0, function* () {
            let nodes = [];
            url = url || this.proxyURL;
            const query = this.getUrlQuery(options);
            try {
                nodes = yield send("GET", `${url}/nodes?${query}`, "", {});
            }
            catch (_a) {
                throw Error(`Invalid query: ${query}`);
            }
            if (nodes.length) {
                return nodes;
            }
            throw Error(`Couldn't find any node with options: ${JSON.stringify(options)}`);
        });
    }
    /**
     * Get farm id from farm name.
     * It returns 0 in case the farm name is not found.
     * @param  {string} name
     * @returns {Promise<number>}
     */
    getFarmIdFromFarmName(name, farms = null, url = "") {
        return __awaiter(this, void 0, void 0, function* () {
            if (!farms) {
                farms = yield this.getAllFarms(url);
            }
            const filteredFarms = farms.filter(f => String(f.name).toLowerCase() === name.toLowerCase());
            if (filteredFarms.length === 0) {
                return 0; // not found
            }
            return filteredFarms[0].farmId;
        });
    }
    getUrlQuery(options = {}) {
        const params = {
            free_cru: options.cru,
            free_mru: Math.ceil(this._g2b(options.mru)) || "",
            free_sru: Math.ceil(this._g2b(options.sru)) || "",
            free_hru: Math.ceil(this._g2b(options.hru)) || "",
            free_ips: options.publicIPs ? 1 : "",
            ipv4: options.accessNodeV4,
            ipv6: options.accessNodeV6,
            gateway: options.gateway,
            farm_ids: [options.farmId],
            farm_name: options.farmName,
            country: options.country,
            city: options.city,
            dedicated: options.dedicated,
            available_for: options.availableFor,
            status: "up",
        };
        if (options.gateway) {
            params["ipv4"] = true;
            params["ipv6"] = true;
            params["domain"] = true;
        }
        return Object.entries(params)
            .map(param => param.join("="))
            .join("&");
    }
    nodeHasResources(nodeId, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const resources = yield this.getNodeFreeResources(nodeId);
            if (resources.mru < this._g2b(options.mru) ||
                resources.sru < this._g2b(options.sru) ||
                resources.hru < this._g2b(options.hru)) {
                return false;
            }
            return true;
        });
    }
    nodeAvailableForTwinId(nodeId, twinId) {
        return __awaiter(this, void 0, void 0, function* () {
            const node = yield send("GET", `${this.proxyURL}/nodes/${nodeId}`, "", {});
            if (node.dedicated && node.rentedByTwinId != twinId) {
                return false;
            }
            return true;
        });
    }
}
export { Nodes };
