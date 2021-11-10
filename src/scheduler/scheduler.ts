import { send } from "../helpers/requests";
import { events } from "../helpers/events";

type FilterOptions = {
    cru?: number; // GB
    mru?: number; // GB
    sru?: number; // GB
    hru?: number; // GB
    accessNodeV4?: boolean;
    accessNodeV6?: boolean;
    gateway?: boolean;
    farm?: number;
    country?: string;
    city?: string;
};

class Scheduler {
    URL: string;

    constructor(public explorerURL: string) {
        this.URL = explorerURL;
    }

    _g2b(GB: number): number {
        return GB * 1024 * 1024 * 1024;
    }

    async getFarms(url: string = "") {
        let r: string;
        if (url) r = url;
        else r = this.URL;

        return send("get", `${r}/farms`, "", {})
            .then(res => {
                return res["data"]["farms"];
            })
            .catch(err => {
                throw err;
            });
    }

    async getNodes(url: string = "") {
        let r: string;
        if (url) r = url;
        else r = this.URL;

        const ret = await send("get", `${r}/nodes`, "", {});

        return ret as Record<string, unknown>[];
    }

    async getNodesByFarmID(farmID, url: string = "") {
        let r: string;
        if (url) r = url;
        else r = this.URL;

        return send("get", `${r}/nodes?farm_id=${farmID}`, "", {})
            .then(res => {
                if (res) return res;
                else throw new Error(`The farm with id ${farmID}: have not any nodes`);
            })
            .catch(err => {
                throw err;
            });
    }

    async freeCapacity(nodeID, url: string = ""): Promise<Record<string, unknown>> {
        let r: string;
        if (url) r = url;
        else r = this.URL;

        return send("get", `${r}/nodes/${nodeID}`, "", {})
            .then(res => {
                const node = res;
                let ret: Record<string, unknown> = {};

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

    async checkNodeOptions(
        node: Record<string, unknown>,
        options: FilterOptions,
        url: string = "",
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
            (options.farm && options.farm !== node.farmId)
        ) {
            return { valid: false };
        }
        if (node.state !== "up") {
            // events.emit("logs", `scheduler: Node ${node.nodeId} is down`);
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
                events.emit("logs", `scheduler: Node ${node.nodeId} has not enough capacity`);
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

    async filterNodes(options: FilterOptions, url: string = ""): Promise<Record<string, unknown>[]> {
        return this.getNodes(url)
            .then(nodes => {
                const promises = nodes.map(n => this.checkNodeOptions(n, options));
                return Promise.all(promises);
            })
            .then(nodes => {
                const ret = nodes.filter(n => n.valid);
                if (ret.length > 0) {
                    return ret;
                } else {
                    events.emit("logs", `scheduler: Can not find valid node for these options`);
                    throw new Error("scheduler: Can not find valid node for these options");
                }
            });
    }
}

export { Scheduler, FilterOptions };
