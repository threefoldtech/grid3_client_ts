import { Workload } from "../zos/workload";
import { Znet } from "../zos/znet";
import { Deployment } from "../zos/deployment";
declare class WireGuardKeys {
    privateKey: string;
    publicKey: string;
}
declare class Node {
    node_id: number;
    contract_id: number;
    reserved_ips: string[];
}
declare class AccessPoint {
    subnet: string;
    wireguard_public_key: string;
    node_id: number;
}
declare class Network {
    name: string;
    ipRange: string;
    rmbClient: any;
    storePath: string;
    url: string;
    nodes: Node[];
    deployments: Deployment[];
    reservedSubnets: string[];
    networks: Znet[];
    accessPoints: AccessPoint[];
    constructor(name: string, ipRange: string, rmbClient: any, storePath: string, url: string);
    addAccess(node_id: number, ipv4: boolean): Promise<string>;
    addNode(node_id: number, metadata?: string, description?: string): Promise<Workload>;
    deleteNode(node_id: number): number;
    updateNetwork(znet: any): Znet;
    updateNetworkDeployments(): void;
    load(): Promise<void>;
    _fromObj(net: Znet): Znet;
    exists(): boolean;
    nodeExists(node_id: number): boolean;
    hasAccessPoint(node_id: number): boolean;
    generateWireguardKeypair(): WireGuardKeys;
    getPublicKey(privateKey: string): string;
    getNodeWGPublicKey(node_id: number): Promise<string>;
    getNodeWGListeningPort(node_id: number): number;
    getFreeIP(node_id: number, subnet?: string): string;
    getNodeReservedIps(node_id: number): string[];
    deleteReservedIp(node_id: number, ip: string): string;
    getNodeSubnet(node_id: number): string;
    getReservedSubnets(): string[];
    getFreeSubnet(): string;
    getAccessPoints(): Promise<AccessPoint[]>;
    getNetworks(): any;
    getNetworkNames(): string[];
    getFreePort(node_id: number): Promise<number>;
    isPrivateIP(ip: string): boolean;
    getNodeEndpoint(node_id: number): Promise<string>;
    wgRoutingIP(subnet: string): string;
    getWireguardConfig(subnet: string, userprivKey: string, peerPubkey: string, endpoint: string): string;
    save(contract_id?: number, node_id?: number): void;
    _save(network: any): void;
    delete(): void;
    generatePeers(): Promise<void>;
}
export { Network };
//# sourceMappingURL=network.d.ts.map