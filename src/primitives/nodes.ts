import { default as PrivateIp } from "private-ip";

import { GridClient } from "../client";
import { Graphql } from "../clients/graphql/client";
import { TFClient } from "../clients/tf-grid/client";
import { events } from "../helpers/events";
import { send } from "../helpers/requests";
import { FilterOptions } from "../modules/models";

interface FarmInfo {
    name: string;
    farmId: number;
    twinId: number;
    version: number;
    pricingPolicyId: number;
    stellarAddress: string;
    publicIPs: PublicIPs[];
}
interface PublicIPs {
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
    country: string;
    gridVersion: number;
    city: string;
    uptime: number;
    created: number;
    farmingPolicyId: number;
    updatedAt: string;
    cru: string;
    mru: string;
    sru: string;
    hru: string;
    publicConfig: PublicConfig;
    status: string;
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
        total: NodeResources;
        used: NodeResources;
    };
}

class Nodes {
    gqlClient: Graphql;
    constructor(public graphqlURL: string, public proxyURL: string) {
        this.gqlClient = new Graphql(graphqlURL);
    }

    async getNodeTwinId(node_id: number): Promise<number> {
        const body = `query getNodeTwinId($nodeId: Int!){
            nodes(where: { nodeId_eq: $nodeId }) {
            twinId
            }
        }`;
        const response = await this.gqlClient.query(body, { nodeId: node_id });
        if (response["data"]["nodes"]["length"] === 0) {
            throw Error(`Couldn't find a node with id: ${node_id}`);
        }
        return response["data"]["nodes"][0]["twinId"];
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
        return GB * 1024 * 1024 * 1024;
    }

    async getFarms(page = 1, maxResult = 50, url = ""): Promise<FarmInfo[]> {
        let r: string;
        if (url) r = url;
        else r = this.proxyURL;

        return send("get", `${r}/farms?page=${page}&max_result=${maxResult}`, "", {})
            .then(res => {
                return res["data"]["farms"];
            })
            .catch(err => {
                throw err;
            });
    }

    async getAllFarms(url = ""): Promise<FarmInfo[]> {
        const farmsCount = await this.gqlClient.getItemTotalCount("farms");
        return await this.getFarms(1, farmsCount, url);
    }

    async checkFarmHasFreePublicIps(farmId: number, farms: FarmInfo[] = null, url = ""): Promise<boolean> {
        if (!farms) {
            farms = await this.getAllFarms(url);
        }
        return farms
            .filter(farm => farm.publicIPs.filter(ip => ip.contractId === 0).length > 0)
            .map(farm => farm.farmId)
            .includes(farmId);
    }

    async getNodes(page = 1, maxResult = 50, url = ""): Promise<NodeInfo[]> {
        let r: string;
        if (url) r = url;
        else r = this.proxyURL;

        const ret = await send("get", `${r}/nodes?page=${page}&max_result=${maxResult}`, "", {});
        return ret;
    }

    async getAllNodes(url = ""): Promise<NodeInfo[]> {
        const farmsCount = await this.gqlClient.getItemTotalCount("nodes");
        return await this.getNodes(1, farmsCount, url);
    }

    async getNodesByFarmId(farmId: number, url = ""): Promise<NodeInfo[]> {
        const nodesCount = await this.gqlClient.getItemTotalCount("nodes", `(where: {farmId_eq: ${farmId}})`);
        let r: string;
        if (url) r = url;
        else r = this.proxyURL;

        return send("get", `${r}/nodes?farm_id=${farmId}&max_result=${nodesCount}`, "", {})
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

                ret.cru = +node.capacity.total.cru - +node.capacity.used.cru;
                ret.mru = +node.capacity.total.mru - +node.capacity.used.mru;
                ret.sru = +node.capacity.total.sru - +node.capacity.used.sru;
                ret.hru = +node.capacity.total.hru - +node.capacity.used.hru;

                return ret;
            })
            .catch(err => {
                if (err.response.status === 404) {
                    throw Error(`Node: ${nodeId} is not found`);
                } else if (err.response.status === 502) {
                    throw Error(`Node: ${nodeId} is not reachable`);
                } else {
                    throw err;
                }
            });
    }

    private async checkNodeOptions(node: NodeInfo, options: FilterOptions, farms: FarmInfo[]): Promise<NodeInfo> {
        const hasDomain = node.publicConfig.domain ? true : false;
        const hasPublicIpv4 = node.publicConfig.ipv4 ? true : false;
        const hasPublicIpv6 = node.publicConfig.ipv6 ? true : false;
        if (
            (options.country && options.country !== node.country) ||
            (options.city && options.city !== node.city) ||
            (options.accessNodeV4 && !hasPublicIpv4) ||
            (options.accessNodeV6 && !hasPublicIpv6) ||
            (options.gateway && !hasDomain) ||
            (options.farmId && options.farmId !== node.farmId) ||
            (options.farmName && (await this.getFarmIdFromFarmName(options.farmName, farms)) !== +node.farmId) ||
            (options.publicIPs && !(await this.checkFarmHasFreePublicIps(+node.farmId, farms)))
        ) {
            node["valid"] = false;
            return node;
        }
        if (node.status !== "up") {
            node["valid"] = false;
            return node;
        }
        if (options.cru || options.mru || options.sru || options.hru) {
            const nodeFreeResources = await this.getNodeFreeResources(node.nodeId);
            if (
                (options.cru && options.cru > nodeFreeResources.cru) ||
                (options.mru && this._g2b(options.mru) > nodeFreeResources.mru) ||
                (options.sru && this._g2b(options.sru) > nodeFreeResources.sru) ||
                (options.hru && this._g2b(options.hru) > nodeFreeResources.hru)
            ) {
                events.emit("logs", `Nodes: Node ${node.nodeId} doesn't have enough capacity`);
                node["valid"] = false;
                return node;
            }
        }
        node["valid"] = true;
        return node;
    }

    async filterNodes(options: FilterOptions = {}, url = ""): Promise<NodeInfo[]> {
        const farms = await this.getAllFarms(url);
        return await this.getAllNodes(url)
            .then(nodes => {
                const promises = nodes.map(n => this.checkNodeOptions(n, options, farms));
                return Promise.all(promises);
            })
            .then(nodes => {
                const ret = nodes.filter(n => n["valid"]);
                if (ret.length > 0) {
                    return ret;
                } else {
                    throw new Error(`Nodes: Couldn't find a valid node for these options ${JSON.stringify(options)}`);
                }
            });
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
}

export { Nodes, FarmInfo, NodeResources, NodeInfo, PublicIPs, PublicConfig };
