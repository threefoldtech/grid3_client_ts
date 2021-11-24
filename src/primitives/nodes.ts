import { default as PrivateIp } from "private-ip";
import { IsBoolean, IsOptional, IsString, Min } from "class-validator";
import { Expose, plainToClass } from "class-transformer";

import { validateObject } from "../helpers/validator";
import { events } from "../helpers/events";
import { TFClient } from "../clients/tf-grid/client";
import { send } from "../helpers/requests";
import { GridClient } from "../client";

class FilterOptions {
    @Expose() @IsOptional() @Min(0) cru?: number;
    @Expose() @IsOptional() @Min(0) mru?: number; // GB
    @Expose() @IsOptional() @Min(0) sru?: number; // GB
    @Expose() @IsOptional() @Min(0) hru?: number; // GB
    @Expose() @IsOptional() @IsBoolean() publicIPs?: boolean;
    @Expose() @IsOptional() @IsBoolean() accessNodeV4?: boolean;
    @Expose() @IsOptional() @IsBoolean() accessNodeV6?: boolean;
    @Expose() @IsOptional() @IsBoolean() gateway?: boolean;
    @Expose() @IsOptional() @Min(1) farmId?: number;
    @Expose() @IsOptional() @IsString() farmName?: string;
    @Expose() @IsOptional() @IsString() country?: string;
    @Expose() @IsOptional() @IsString() city?: string;
}

class Nodes {
    public farmsWithPublicIPs: any;
    constructor(public graphqlURL: string, public proxyURL: string) {}

    async getNodeTwinId(node_id: number): Promise<number> {
        const headers = { "Content-Type": "application/json" };
        const body = `{
            nodes(where: { nodeId_eq: ${node_id} }) {
            twinId
            }
        }`;
        const response = await send("post", this.graphqlURL, JSON.stringify({ query: body }), headers);
        if (response["data"]["nodes"]["length"] === 0) {
            throw Error(`Couldn't find a node with id: ${node_id}`);
        }
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

    async getFarms(url = ""): Promise<Record<string, unknown>[]> {
        let r: string;
        if (url) r = url;
        else r = this.proxyURL;

        return send("get", `${r}/farms`, "", {})
            .then(res => {
                this.farmsWithPublicIPs = res["data"]["farms"];
                return res["data"]["farms"];
            })
            .catch(err => {
                throw err;
            });
    }

    async farmsHavePublicIPs(url = "") {
        if (!this.farmsWithPublicIPs){
            const f = await this.getFarms(url);
        }

        const farms = JSON.parse(JSON.stringify(this.farmsWithPublicIPs));
        return farms
            .filter(farm => {
                return farm.publicIPs.length > 0;
            })
            .map(farm => {
                return farm.farmId;
            });
    }

    async getNodes(url = "") {
        let r: string;
        if (url) r = url;
        else r = this.proxyURL;

        const ret = await send("get", `${r}/nodes`, "", {});

        return ret as Record<string, unknown>[];
    }

    async getNodesByFarmID(farmID, url = "") {
        let r: string;
        if (url) r = url;
        else r = this.proxyURL;

        return send("get", `${r}/nodes?farm_id=${farmID}`, "", {})
            .then(res => {
                if (res) return res;
                else throw new Error(`The farm with id ${farmID}: have not any nodes`);
            })
            .catch(err => {
                throw err;
            });
    }

    async freeCapacity(nodeID, url = ""): Promise<Record<string, unknown>> {
        let r: string;
        if (url) r = url;
        else r = this.proxyURL;

        return send("get", `${r}/nodes/${nodeID}`, "", {})
            .then(res => {
                const node = res;
                const ret: Record<string, unknown> = {};

                ret.cru = node["capacity"]["total"]["cru"] - node["capacity"]["used"]["cru"];
                ret.mru = +node["capacity"]["total"]["mru"] - +node["capacity"]["used"]["mru"];
                ret.sru = +node["capacity"]["total"]["sru"] - +node["capacity"]["used"]["sru"];
                ret.hru = +node["capacity"]["total"]["hru"] - +node["capacity"]["used"]["hru"];

                return ret;
            })
            .catch(err => {
                throw err;
            });
    }

    private async checkNodeOptions(
        node: Record<string, unknown>,
        options: FilterOptions,
        url = "",
    ): Promise<Record<string, unknown>> {
        const hasDomain = node.publicConfig["domain"] ? true : false;
        const hasPublicIpv4 = node.publicConfig["ipv4"] ? true : false;
        const hasPublicIpv6 = node.publicConfig["ipv6"] ? true : false;
        if (
            (options.country && options.country !== node.country) ||
            (options.city && options.city !== node.city) ||
            (options.accessNodeV4 && !hasPublicIpv4) ||
            (options.accessNodeV6 && !hasPublicIpv6) ||
            (options.gateway && !hasDomain) ||
            (options.farmId && options.farmId !== node.farmId) ||
            (options.farmName && (await this.getFarmIdFromFarmName(options.farmName)) !== node.farmId) ||
            (options.publicIPs && !(await this.farmsHavePublicIPs()).includes(node.farmId))
        ) {
            return { valid: false };
        }
        if (node.state !== "up") {
            return { valid: false };
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
                events.emit("logs", `Nodes: Node ${node.nodeId} has not enough capacity`);
                return { valid: false };
            }
        }
        return {
            nodeId: node.nodeId,
            farm: node.farmId,
            country: node.country,
            hasDomain: hasDomain,
            hasPublicIpv4: hasPublicIpv4,
            hasPublicIpv6: hasPublicIpv6,
            state: node.state,
            capacity: {
                ...nodeCapacity,
            },
            valid: true,
        };
    }

    async filterNodes(options: FilterOptions, url = ""): Promise<Record<string, unknown>[]> {
        options = plainToClass(FilterOptions, options, { excludeExtraneousValues: true });
        await validateObject(options);
        await this.getFarms();
        return await this.getNodes(url)
            .then(nodes => {
                const promises = nodes.map(n => this.checkNodeOptions(n, options));
                return Promise.all(promises);
            })
            .then(nodes => {
                const ret = nodes.filter(n => n.valid);
                if (ret.length > 0) {
                    return ret;
                } else {
                    throw new Error(`Nodes: Can not find a valid node for these options ${JSON.stringify(options)}`);
                }
            });
    }

    /**
     * Get farm id from farm name.
     * It returns 0 in case the farm name is not found.
     * @param  {string} name
     * @returns Promise<number>
     */
    async getFarmIdFromFarmName(name: string): Promise<number> {
        const headers = { "Content-Type": "application/json" };
        const body = `{
            farms(where: {name_eq: "${name}"}) {
              farmId
            }
          }`;
        const response = await send("post", this.graphqlURL, JSON.stringify({ query: body }), headers);
        if (response["data"]["farms"]["length"] === 0) {
            return 0;
        }
        return response["data"]["farms"][0]["farmId"];
    }
}

export { Nodes, FilterOptions };
