import { Graphql } from "../clients/graphql/client";
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
declare class Nodes {
    graphqlURL: string;
    proxyURL: string;
    gqlClient: Graphql;
    constructor(graphqlURL: string, proxyURL: string);
    getNodeTwinId(node_id: number): Promise<number>;
    getAccessNodes(): Promise<Record<string, unknown>>;
    getNodeIdFromContractId(contractId: number, mnemonic: string): Promise<number>;
    _g2b(GB: number): number;
    getFarms(page?: number, pageSize?: number, url?: string): Promise<FarmInfo[]>;
    getAllFarms(url?: string): Promise<FarmInfo[]>;
    checkFarmHasFreePublicIps(farmId: number, farms?: FarmInfo[], url?: string): Promise<boolean>;
    getNodes(page?: number, pageSize?: number, url?: string): Promise<NodeInfo[]>;
    getAllNodes(url?: string): Promise<NodeInfo[]>;
    getNodesByFarmId(farmId: number, url?: string): Promise<NodeInfo[]>;
    getNodeFreeResources(nodeId: number, url?: string): Promise<NodeResources>;
    filterNodes(options?: FilterOptions, url?: string): Promise<NodeInfo[]>;
    /**
     * Get farm id from farm name.
     * It returns 0 in case the farm name is not found.
     * @param  {string} name
     * @returns {Promise<number>}
     */
    getFarmIdFromFarmName(name: string, farms?: FarmInfo[], url?: string): Promise<number>;
    getUrlQuery(options?: FilterOptions): string;
    nodeHasResources(nodeId: number, options: FilterOptions): Promise<boolean>;
    nodeAvailableForTwinId(nodeId: number, twinId: number): Promise<boolean>;
}
export { Nodes, FarmInfo, NodeResources, NodeInfo, PublicIps, PublicConfig };
//# sourceMappingURL=nodes.d.ts.map