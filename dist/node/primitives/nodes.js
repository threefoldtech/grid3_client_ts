"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Nodes = void 0;
const private_ip_1 = __importDefault(require("private-ip"));
const client_1 = require("../client");
const client_2 = require("../clients/graphql/client");
const client_3 = require("../clients/tf-grid/client");
const requests_1 = require("../helpers/requests");
class Nodes {
    graphqlURL;
    proxyURL;
    gqlClient;
    constructor(graphqlURL, proxyURL) {
        this.graphqlURL = graphqlURL;
        this.proxyURL = proxyURL;
        this.gqlClient = new client_2.Graphql(graphqlURL);
    }
    async getNodeTwinId(node_id) {
        const body = `query getNodeTwinId($nodeId: Int!){
            nodes(where: { nodeID_eq: $nodeId }) {
            twinID
            }
        }`;
        const response = await this.gqlClient.query(body, { nodeId: node_id });
        if (response["data"]["nodes"]["length"] === 0) {
            throw Error(`Couldn't find a node with id: ${node_id}`);
        }
        return response["data"]["nodes"][0]["twinID"];
    }
    async getAccessNodes() {
        const accessNodes = {};
        const nodes = await this.filterNodes({ accessNodeV4: true, accessNodeV6: true });
        for (const node of nodes) {
            const ipv4 = node.publicConfig.ipv4;
            const ipv6 = node.publicConfig.ipv6;
            const domain = node.publicConfig.domain;
            if ((0, private_ip_1.default)(ipv4.split("/")[0]) === false || (0, private_ip_1.default)(ipv6.split("/")[0]) === false) {
                accessNodes[+node.nodeId] = { ipv4: ipv4, ipv6: ipv6, domain: domain };
            }
        }
        if (Object.keys(accessNodes).length === 0) {
            throw Error("Couldn't find any node with public config");
        }
        console.log(accessNodes);
        return accessNodes;
    }
    async getNodeIdFromContractId(contractId, mnemonic) {
        const tfclient = new client_3.TFClient(client_1.GridClient.config.substrateURL, mnemonic, client_1.GridClient.config.storeSecret, client_1.GridClient.config.keypairType);
        const contract = await tfclient.contracts.get(contractId);
        return contract["contract_type"]["nodeContract"]["node_id"];
    }
    _g2b(GB) {
        return GB * 1024 ** 3;
    }
    async getFarms(page = 1, pageSize = 50, url = "") {
        let r;
        if (url)
            r = url;
        else
            r = this.proxyURL;
        return (0, requests_1.send)("get", `${r}/farms?page=${page}&size=${pageSize}`, "", {})
            .then(res => {
            return res;
        })
            .catch(err => {
            throw err;
        });
    }
    async getAllFarms(url = "") {
        const farmsCount = await this.gqlClient.getItemTotalCount("farms", "(orderBy: farmID_ASC)");
        return await this.getFarms(1, farmsCount, url);
    }
    async checkFarmHasFreePublicIps(farmId, farms = null, url = "") {
        if (!farms) {
            farms = await this.getAllFarms(url);
        }
        return farms
            .filter(farm => farm.publicIps.filter(ip => ip.contractId === 0).length > 0)
            .map(farm => farm.farmId)
            .includes(farmId);
    }
    async getNodes(page = 1, pageSize = 50, url = "") {
        let r;
        if (url)
            r = url;
        else
            r = this.proxyURL;
        const ret = await (0, requests_1.send)("get", `${r}/nodes?page=${page}&size=${pageSize}`, "", {});
        return ret;
    }
    async getAllNodes(url = "") {
        const nodesCount = await this.gqlClient.getItemTotalCount("nodes", "(orderBy: nodeID_ASC)");
        return await this.getNodes(1, nodesCount, url);
    }
    async getNodesByFarmId(farmId, url = "") {
        const nodesCount = await this.gqlClient.getItemTotalCount("nodes", `(where: {farmId_eq: ${farmId}}, orderBy: nodeID_ASC)`);
        let r;
        if (url)
            r = url;
        else
            r = this.proxyURL;
        return (0, requests_1.send)("get", `${r}/nodes?farm_id=${farmId}&size=${nodesCount}`, "", {})
            .then(res => {
            if (res)
                return res;
            else
                throw new Error(`The farm with id ${farmId}: doesn't have any nodes`);
        })
            .catch(err => {
            throw err;
        });
    }
    async getNodeFreeResources(nodeId, url = "") {
        let r;
        if (url)
            r = url;
        else
            r = this.proxyURL;
        return (0, requests_1.send)("get", `${r}/nodes/${nodeId}`, "", {})
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
    }
    async filterNodes(options = {}, url = "") {
        let nodes = [];
        url = url || this.proxyURL;
        const query = this.getUrlQuery(options);
        try {
            nodes = await (0, requests_1.send)("GET", `${url}/nodes?${query}`, "", {});
        }
        catch {
            throw Error(`Invalid query: ${query}`);
        }
        if (nodes.length) {
            return nodes;
        }
        throw Error(`Couldn't find any node with options: ${JSON.stringify(options)}`);
    }
    /**
     * Get farm id from farm name.
     * It returns 0 in case the farm name is not found.
     * @param  {string} name
     * @returns {Promise<number>}
     */
    async getFarmIdFromFarmName(name, farms = null, url = "") {
        if (!farms) {
            farms = await this.getAllFarms(url);
        }
        const filteredFarms = farms.filter(f => String(f.name).toLowerCase() === name.toLowerCase());
        if (filteredFarms.length === 0) {
            return 0; // not found
        }
        return filteredFarms[0].farmId;
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
    async nodeHasResources(nodeId, options) {
        const resources = await this.getNodeFreeResources(nodeId);
        if (resources.mru < this._g2b(options.mru) ||
            resources.sru < this._g2b(options.sru) ||
            resources.hru < this._g2b(options.hru)) {
            return false;
        }
        return true;
    }
    async nodeAvailableForTwinId(nodeId, twinId) {
        const node = await (0, requests_1.send)("GET", `${this.proxyURL}/nodes/${nodeId}`, "", {});
        if (node.dedicated && node.rentedByTwinId != twinId) {
            return false;
        }
        return true;
    }
}
exports.Nodes = Nodes;
