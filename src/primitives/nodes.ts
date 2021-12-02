import { default as PrivateIp } from "private-ip";
import { IsBoolean, IsInt, IsOptional, IsString, Min } from "class-validator";
import { Expose, plainToClass } from "class-transformer";

import { validateObject } from "../helpers/validator";
import { events } from "../helpers/events";
import { TFClient } from "../clients/tf-grid/client";
import { send } from "../helpers/requests";
import { GridClient } from "../client";

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

class FilterOptions {
    @Expose() @IsOptional() @Min(0) cru?: number;
    @Expose() @IsOptional() @Min(0) mru?: number; // GB
    @Expose() @IsOptional() @Min(0) sru?: number; // GB
    @Expose() @IsOptional() @Min(0) hru?: number; // GB
    @Expose() @IsOptional() @IsBoolean() publicIPs?: boolean;
    @Expose() @IsOptional() @IsBoolean() accessNodeV4?: boolean;
    @Expose() @IsOptional() @IsBoolean() accessNodeV6?: boolean;
    @Expose() @IsOptional() @IsBoolean() gateway?: boolean;
    @Expose() @IsOptional() @IsInt() @Min(1) farmId?: number;
    @Expose() @IsOptional() @IsString() farmName?: string;
    @Expose() @IsOptional() @IsString() country?: string;
    @Expose() @IsOptional() @IsString() city?: string;
}

class Nodes {
    constructor(public graphqlURL: string, public proxyURL: string) {}

    async getNodeTwinId(node_id: number): Promise<number> {
        const headers = { "Content-Type": "application/json" };
        const body = `query getNodeTwinId($nodeId: Int!){
            nodes(where: { nodeId_eq: $nodeId }) {
            twinId
            }
        }`;
        const response = await send(
            "post",
            this.graphqlURL,
            JSON.stringify({ query: body, variables: { nodeId: node_id } }),
            headers,
        );
        if (response["data"]["nodes"]["length"] === 0) {
            throw Error(`Couldn't find a node with id: ${node_id}`);
        }
        return response["data"]["nodes"][0]["twinId"];
    }

    async getAccessNodes(): Promise<Record<string, unknown>> {
        const headers = { "Content-Type": "application/json" };
        const countBody = `query { nodes: nodesConnection { count: totalCount } }`;
        const countResponse = await send("post", this.graphqlURL, JSON.stringify({ query: countBody }), headers);
        const nodesCount = countResponse["data"]["nodes"]["count"];
        const body = `query getNodes($count: Int!) {
            nodes(limit: $count) {
          nodeId
          publicConfig{
              ipv4
              ipv6
              domain
          }
        }
      }`;
        const nodeResponse = await send(
            "post",
            this.graphqlURL,
            JSON.stringify({ query: body, variables: { count: nodesCount } }),
            headers,
        );
        const nodes = nodeResponse["data"]["nodes"];
        const accessNodes = {};
        for (const node of nodes as Record<string, unknown>[]) {
            if (!node.publicConfig) {
                continue;
            }
            const ipv4 = node.publicConfig["ipv4"];
            const ipv6 = node.publicConfig["ipv4"];
            const domain = node.publicConfig["domain"];
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

    async getFarms(url = ""): Promise<FarmInfo[]> {
        let r: string;
        if (url) r = url;
        else r = this.proxyURL;

        return send("get", `${r}/farms`, "", {})
            .then(res => {
                return res["data"]["farms"];
            })
            .catch(err => {
                throw err;
            });
    }

    async CheckFarmHasFreePublicIPs(farmId: number, farms: FarmInfo[] = null, url = ""): Promise<boolean> {
        if (!farms) {
            farms = await this.getFarms(url);
        }
        return farms
            .filter(farm => farm.publicIPs.filter(ip => ip.contractId === 0).length > 0)
            .map(farm => farm.farmId)
            .includes(farmId);
    }

    async getNodes(url = ""): Promise<NodeInfo[]> {
        let r: string;
        if (url) r = url;
        else r = this.proxyURL;

        const ret = await send("get", `${r}/nodes`, "", {});
        return ret;
    }

    async getNodesByFarmID(farmId: number, url = "") {
        let r: string;
        if (url) r = url;
        else r = this.proxyURL;

        return send("get", `${r}/nodes?farm_id=${farmId}`, "", {})
            .then(res => {
                if (res) return res;
                else throw new Error(`The farm with id ${farmId}: doesn't have any nodes`);
            })
            .catch(err => {
                throw err;
            });
    }

    async freeCapacity(nodeId: number, url = ""): Promise<Record<string, number>> {
        let r: string;
        if (url) r = url;
        else r = this.proxyURL;

        return send("get", `${r}/nodes/${nodeId}`, "", {})
            .then(res => {
                const node: NodeCapacity = res;
                const ret: Record<string, number> = {};

                ret.cru = node.capacity.total.cru - node.capacity.used.cru;
                ret.mru = +node.capacity.total.mru - +node.capacity.used.mru;
                ret.sru = +node.capacity.total.sru - +node.capacity.used.sru;
                ret.hru = +node.capacity.total.hru - +node.capacity.used.hru;

                return ret;
            })
            .catch(err => {
                throw err;
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
            (options.publicIPs && !(await this.CheckFarmHasFreePublicIPs(+node.farmId, farms)))
        ) {
            node["valid"] = false;
            return node;
        }
        if (node.status !== "up") {
            node["valid"] = false;
            return node;
        }
        let nodeCapacity;
        if (options.cru || options.mru || options.sru || options.hru) {
            nodeCapacity = await this.freeCapacity(node.nodeId);
            if (
                (options.cru && options.cru > nodeCapacity.cru) ||
                (options.mru && this._g2b(options.mru) > nodeCapacity.mru) ||
                (options.sru && this._g2b(options.sru) > nodeCapacity.mru) ||
                (options.hru && this._g2b(options.hru) > nodeCapacity.hru)
            ) {
                events.emit("logs", `Nodes: Node ${node.nodeId} doesn't have enough capacity`);
                node["valid"] = false;
                return node;
            }
        }
        node["valid"] = true;
        return node;
    }

    async filterNodes(options: FilterOptions, url = ""): Promise<NodeInfo[]> {
        options = plainToClass(FilterOptions, options, { excludeExtraneousValues: true });
        await validateObject(options);
        const farms = await this.getFarms(url);
        return await this.getNodes(url)
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
     * @returns Promise<number>
     */
    async getFarmIdFromFarmName(name: string, farms: FarmInfo[] = null, url = ""): Promise<number> {
        if (!farms) {
            farms = await this.getFarms(url);
        }
        const filteredFarms = farms.filter(f => String(f.name).toLowerCase() === name.toLowerCase());
        if (filteredFarms.length === 0) {
            return 0; // not found
        }
        return filteredFarms[0].farmId;
    }
}

export { Nodes, FilterOptions };
