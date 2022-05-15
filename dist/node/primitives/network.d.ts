import { RMB } from "../clients";
import { GridClientConfig } from "../config";
import { BackendStorage } from "../storage/backend";
import { Deployment } from "../zos/deployment";
import { Workload } from "../zos/workload";
import { Znet } from "../zos/znet";
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
    config: GridClientConfig;
    nodes: Node[];
    deployments: Deployment[];
    reservedSubnets: string[];
    networks: Znet[];
    accessPoints: AccessPoint[];
    backendStorage: BackendStorage;
    _endpoints: Record<string, string>;
    _accessNodes: number[];
    rmb: RMB;
    constructor(name: string, ipRange: string, config: GridClientConfig);
    addAccess(node_id: number, ipv4: boolean): Promise<string>;
    addNode(node_id: number, metadata?: string, description?: string, subnet?: string): Promise<Workload>;
    deleteNode(node_id: number): Promise<number>;
    updateNetwork(znet: any): Znet;
    updateNetworkDeployments(): void;
    load(): Promise<void>;
    _fromObj(net: Znet): Znet;
    exists(): Promise<boolean>;
    nodeExists(node_id: number): boolean;
    hasAccessPoint(node_id: number): boolean;
    getAccessNodes(): Promise<number[]>;
    generateWireguardKeypair(): WireGuardKeys;
    getPublicKey(privateKey: string): string;
    getNodeWGPublicKey(node_id: number): Promise<string>;
    getNodeWGListeningPort(node_id: number): number;
    getFreeIP(node_id: number, subnet?: string): string;
    validateUserIP(node_id: number, ip_address?: string): string;
    getNodeReservedIps(node_id: number): string[];
    deleteReservedIp(node_id: number, ip: string): string;
    getNodeSubnet(node_id: number): string;
    getReservedSubnets(): string[];
    getFreeSubnet(): string;
    ValidateFreeSubnet(subnet: any): string;
    getAccessPoints(): Promise<AccessPoint[]>;
    getNetworksPath(): string;
    getNetwork(): Promise<any>;
    getNetworkNames(): Promise<string[]>;
    getFreePort(node_id: number): Promise<number>;
    isPrivateIP(ip: string): boolean;
    getNodeEndpoint(node_id: number): Promise<string>;
    wgRoutingIP(subnet: string): string;
    getWireguardConfig(subnet: string, userprivKey: string, peerPubkey: string, endpoint: string): string;
    save(contract_id?: number, node_id?: number): Promise<void>;
    _save(network: any): Promise<void>;
    delete(): Promise<void>;
    generatePeers(): Promise<void>;
}
export { Network, AccessPoint, WireGuardKeys, Node };
//# sourceMappingURL=network.d.ts.map