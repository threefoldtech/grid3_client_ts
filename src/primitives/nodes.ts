import { default as PrivateIp } from "private-ip";

import { GridClient } from "../client";
import { Graphql } from "../clients/graphql/client";
import { TFClient } from "../clients/tf-grid/client";
import { send } from "../helpers/requests";
import { FilterOptions } from "../modules/models";

interface FarmInfo {
    name: string;
    farmId: number;
    twinId: number;
    version: number;
    pricingPolicyId: number;
    stellarAddress: string;
    publicIps: PublicIps[];
}
interface PublicIps {
    id: string;
    ip: string;
    contractId: number;
    gateway: string;
}

interface NodeInfo {
    version: number;
    id: string;
    nodeId: number;
    farmId: number;
    twinId: number;
    gridVersion: number;
    uptime: number;
    created: number;
    farmingPolicyId: number;
    updatedAt: string;
    total_resources: NodeResources;
    used_resources: NodeResources;
    location: {
        country: string;
        city: string;
    };
    publicConfig: PublicConfig;
    status: string;
    certificationType: string;
}
interface PublicConfig {
    domain: string;
    gw4: string;
    gw6: string;
    ipv4: string;
    ipv6: string;
}

interface NodeResources {
    cru: number;
    sru: number;
    hru: number;
    mru: number;
    ipv4u: number;
}
interface NodeCapacity {
    capacity: {
        total_resources: NodeResources;
        used_resources: NodeResources;
    };
}

class Nodes {
    gqlClient: Graphql;
    constructor(public graphqlURL: string, public proxyURL: string) {
        this.gqlClient = new Graphql(graphqlURL);
    }

    async getNodeTwinId(node_id: number): Promise<number> {
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

    async getAccessNodes(): Promise<Record<string, unknown>> {
        const accessNodes = {};
        const nodes = await this.filterNodes({ accessNodeV4: true, accessNodeV6: true });
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
    }

    async getNodeIdFromContractId(contractId: number, mnemonic: string): Promise<number> {
        const tfclient = new TFClient(
            GridClient.config.substrateURL,
            mnemonic,
            GridClient.config.storeSecret,
            GridClient.config.keypairType,
        );
        const contract = await tfclient.contracts.get(contractId);
        return contract["contract_type"]["nodeContract"]["node_id"];
    }

    _g2b(GB: number): number {
        return GB * 1024 ** 3;
    }

    async getFarms(page = 1, pageSize = 50, url = ""): Promise<FarmInfo[]> {
        let r: string;
        if (url) r = url;
        else r = this.proxyURL;

        return send("get", `${r}/farms?page=${page}&size=${pageSize}`, "", {})
            .then(res => {
                return res;
            })
            .catch(err => {
                throw err;
            });
    }

    async getAllFarms(url = ""): Promise<FarmInfo[]> {
        const farmsCount = await this.gqlClient.getItemTotalCount("farms", "(orderBy: farmID_ASC)");
        return await this.getFarms(1, farmsCount, url);
    }

    async checkFarmHasFreePublicIps(farmId: number, farms: FarmInfo[] = null, url = ""): Promise<boolean> {
        if (!farms) {
            farms = await this.getAllFarms(url);
        }
        return farms
            .filter(farm => farm.publicIps.filter(ip => ip.contractId === 0).length > 0)
            .map(farm => farm.farmId)
            .includes(farmId);
    }

    async getNodes(page = 1, pageSize = 50, url = ""): Promise<NodeInfo[]> {
        let r: string;
        if (url) r = url;
        else r = this.proxyURL;

        const ret = await send("get", `${r}/nodes?page=${page}&size=${pageSize}`, "", {});
        return ret;
    }

    async getAllNodes(url = ""): Promise<NodeInfo[]> {
        const nodesCount = await this.gqlClient.getItemTotalCount("nodes", "(orderBy: nodeID_ASC)");
        return await this.getNodes(1, nodesCount, url);
    }

    async getNodesByFarmId(farmId: number, url = ""): Promise<NodeInfo[]> {
        const nodesCount = await this.gqlClient.getItemTotalCount(
            "nodes",
            `(where: {farmId_eq: ${farmId}}, orderBy: nodeID_ASC)`,
        );
        let r: string;
        if (url) r = url;
        else r = this.proxyURL;

        return send("get", `${r}/nodes?farm_id=${farmId}&size=${nodesCount}`, "", {})
            .then(res => {
                if (res) return res;
                else throw new Error(`The farm with id ${farmId}: doesn't have any nodes`);
            })
            .catch(err => {
                throw err;
            });
    }

    async getNodeFreeResources(nodeId: number, url = ""): Promise<NodeResources> {
        let r: string;
        if (url) r = url;
        else r = this.proxyURL;

        return send("get", `${r}/nodes/${nodeId}`, "", {})
            .then(res => {
                const node: NodeCapacity = res;
                const ret: NodeResources = { cru: 0, mru: 0, hru: 0, sru: 0, ipv4u: 0 };

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
                } else if (err.response.status === 502) {
                    throw Error(`Node: ${nodeId} is not reachable`);
                } else {
                    throw err;
                }
            });
    }

    async filterNodes(options: FilterOptions = {}, url = ""): Promise<NodeInfo[]> {
        let nodes = [];
        url = url || this.proxyURL;
        const query = this.getUrlQuery(options);
        try {
            nodes = await send("GET", `${url}/nodes?${query}`, "", {});
        } catch {
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
    async getFarmIdFromFarmName(name: string, farms: FarmInfo[] = null, url = ""): Promise<number> {
        if (!farms) {
            farms = await this.getAllFarms(url);
        }
        const filteredFarms = farms.filter(f => String(f.name).toLowerCase() === name.toLowerCase());
        if (filteredFarms.length === 0) {
            return 0; // not found
        }
        return filteredFarms[0].farmId;
    }

    getUrlQuery(options: FilterOptions = {}) {
        const params = {
            free_cru: options.cru,
            free_mru: Math.ceil(this._g2b(options.mru)) || 0,
            free_sru: Math.ceil(this._g2b(options.sru)) || 0,
            free_hru: Math.ceil(this._g2b(options.hru)) || 0,
            free_ips: options.publicIPs ? 1 : 0,
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

    async nodeHasResources(nodeId: number, options: FilterOptions): Promise<boolean> {
        const resources = await this.getNodeFreeResources(nodeId);
        if (
            resources.mru < this._g2b(options.mru) ||
            resources.sru < this._g2b(options.sru) ||
            resources.hru < this._g2b(options.hru)
        ) {
            return false;
        }
        return true;
    }

    async nodeAvailableForTwinId(nodeId: number, twinId: number): Promise<boolean> {
        const node = await send("GET", `${this.proxyURL}/nodes/${nodeId}`, "", {});

        if (node.dedicated && node.rentedByTwinId != twinId) {
            return false;
        }
        return true;
    }
}

export { Nodes, FarmInfo, NodeResources, NodeInfo, PublicIps, PublicConfig };
