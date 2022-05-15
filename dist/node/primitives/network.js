"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Node = exports.WireGuardKeys = exports.AccessPoint = exports.Network = void 0;
const buffer_1 = require("buffer");
const class_transformer_1 = require("class-transformer");
const netaddr_1 = require("netaddr");
const PATH = __importStar(require("path"));
const private_ip_1 = __importDefault(require("private-ip"));
const tweetnacl_1 = __importDefault(require("tweetnacl"));
const clients_1 = require("../clients");
const events_1 = require("../helpers/events");
const utils_1 = require("../helpers/utils");
const backend_1 = require("../storage/backend");
const workload_1 = require("../zos/workload");
const znet_1 = require("../zos/znet");
const nodes_1 = require("./nodes");
class WireGuardKeys {
    privateKey;
    publicKey;
}
exports.WireGuardKeys = WireGuardKeys;
class Node {
    node_id;
    contract_id;
    reserved_ips = [];
}
exports.Node = Node;
class AccessPoint {
    subnet;
    wireguard_public_key;
    node_id;
}
exports.AccessPoint = AccessPoint;
class Network {
    name;
    ipRange;
    config;
    nodes = [];
    deployments = [];
    reservedSubnets = [];
    networks = [];
    accessPoints = [];
    backendStorage;
    _endpoints = {};
    _accessNodes = [];
    rmb;
    constructor(name, ipRange, config) {
        this.name = name;
        this.ipRange = ipRange;
        this.config = config;
        if ((0, netaddr_1.Addr)(ipRange).prefix !== 16) {
            throw Error("Network ip_range should have a prefix 16");
        }
        if (!this.isPrivateIP(ipRange)) {
            throw Error("Network ip_range should be a private range");
        }
        this.backendStorage = new backend_1.BackendStorage(config.backendStorageType, config.substrateURL, config.mnemonic, config.storeSecret, config.keypairType);
        this.rmb = new clients_1.RMB(config.rmbClient);
    }
    async addAccess(node_id, ipv4) {
        if (!this.nodeExists(node_id)) {
            throw Error(`Node ${node_id} does not exist in the network. Please add it first`);
        }
        events_1.events.emit("logs", `Adding access to node ${node_id}`);
        const nodes = new nodes_1.Nodes(this.config.graphqlURL, this.config.rmbClient["proxyURL"]);
        const accessNodes = await nodes.getAccessNodes();
        if (Object.keys(accessNodes).includes(node_id.toString())) {
            if (ipv4 && !accessNodes[node_id]["ipv4"]) {
                throw Error(`Node ${node_id} does not have ipv4 public config.`);
            }
        }
        else {
            throw Error(`Node ${node_id} is not an access node.`);
        }
        const nodeWGListeningPort = this.getNodeWGListeningPort(node_id);
        let endpoint = "";
        if (accessNodes[node_id]["ipv4"]) {
            endpoint = `${accessNodes[node_id]["ipv4"].split("/")[0]}:${nodeWGListeningPort}`;
        }
        else if (accessNodes[node_id]["ipv6"]) {
            endpoint = `[${accessNodes[node_id]["ipv6"].split("/")[0]}]:${nodeWGListeningPort}`;
        }
        else {
            throw Error(`Couldn't find ipv4 or ipv6 in the public config of node ${node_id} `);
        }
        const nodesWGPubkey = await this.getNodeWGPublicKey(node_id);
        const keypair = this.generateWireguardKeypair();
        const accessPoint = new AccessPoint();
        accessPoint.node_id = node_id;
        accessPoint.subnet = this.getFreeSubnet();
        accessPoint.wireguard_public_key = keypair.publicKey;
        this.accessPoints.push(accessPoint);
        await this.generatePeers();
        this.updateNetworkDeployments();
        return this.getWireguardConfig(accessPoint.subnet, keypair.privateKey, nodesWGPubkey, endpoint);
    }
    async addNode(node_id, metadata = "", description = "", subnet = "") {
        if (this.nodeExists(node_id)) {
            return;
        }
        events_1.events.emit("logs", `Adding node ${node_id} to network ${this.name}`);
        const keypair = this.generateWireguardKeypair();
        let znet = new znet_1.Znet();
        if (!subnet) {
            znet.subnet = this.getFreeSubnet();
        }
        else {
            znet.subnet = subnet;
        }
        znet.ip_range = this.ipRange;
        znet.wireguard_private_key = keypair.privateKey;
        znet.wireguard_listen_port = await this.getFreePort(node_id);
        znet["node_id"] = node_id;
        this.networks.push(znet);
        await this.generatePeers();
        this.updateNetworkDeployments();
        znet = this.updateNetwork(znet);
        const znet_workload = new workload_1.Workload();
        znet_workload.version = 0;
        znet_workload.name = this.name;
        znet_workload.type = workload_1.WorkloadTypes.network;
        znet_workload.data = znet;
        znet_workload.metadata = metadata;
        znet_workload.description = description;
        const node = new Node();
        node.node_id = node_id;
        this.nodes.push(node);
        return znet_workload;
    }
    async deleteNode(node_id) {
        if (!(await this.exists())) {
            return 0;
        }
        events_1.events.emit("logs", `Deleting node ${node_id} from network ${this.name}`);
        let contract_id = 0;
        const nodes = [];
        for (const node of this.nodes) {
            if (node.node_id !== node_id) {
                nodes.push(node);
            }
            else {
                contract_id = node.contract_id;
            }
        }
        this.nodes = nodes;
        this.networks = this.networks.filter(net => net["node_id"] !== node_id);
        const net = this.networks.filter(net => net["node_id"] === node_id);
        this.reservedSubnets = this.reservedSubnets.filter(subnet => subnet === net[0].subnet);
        return contract_id;
    }
    updateNetwork(znet) {
        for (const net of this.networks) {
            if (net.subnet === znet.subnet) {
                return net;
            }
        }
    }
    updateNetworkDeployments() {
        for (const net of this.networks) {
            for (const deployment of this.deployments) {
                const workloads = deployment["workloads"];
                for (const workload of workloads) {
                    if (workload["type"] !== workload_1.WorkloadTypes.network) {
                        continue;
                    }
                    if (net.subnet === workload["data"]["subnet"]) {
                        workload["data"] = net;
                        break;
                    }
                }
                deployment["workloads"] = workloads;
            }
        }
    }
    async load() {
        if (!(await this.exists())) {
            return;
        }
        events_1.events.emit("logs", `Loading network ${this.name}`);
        const network = await this.getNetwork();
        if (network["ip_range"] !== this.ipRange) {
            throw Error(`The same network name ${this.name} with a different ip range already exists`);
        }
        for (const node of network["nodes"]) {
            const nodes = new nodes_1.Nodes(this.config.graphqlURL, this.config.rmbClient["proxyURL"]);
            const node_twin_id = await nodes.getNodeTwinId(node.node_id);
            const payload = JSON.stringify({ contract_id: node.contract_id });
            let res;
            try {
                res = await this.rmb.request([node_twin_id], "zos.deployment.get", payload);
            }
            catch (e) {
                throw Error(`Failed to load network deployment ${node.contract_id} due to ${e}`);
            }
            res["node_id"] = node.node_id;
            for (const workload of res["workloads"]) {
                if (workload["type"] !== workload_1.WorkloadTypes.network ||
                    !(0, netaddr_1.Addr)(this.ipRange).contains((0, netaddr_1.Addr)(workload["data"]["subnet"]))) {
                    continue;
                }
                if (workload.result.state === "deleted") {
                    continue;
                }
                const znet = this._fromObj(workload["data"]);
                znet["node_id"] = node.node_id;
                const n = node;
                this.nodes.push(n);
                this.networks.push(znet);
                this.deployments.push(res);
            }
        }
        await this.getAccessPoints();
        await this.save();
    }
    _fromObj(net) {
        const znet = (0, class_transformer_1.plainToInstance)(znet_1.Znet, net);
        return znet;
    }
    async exists() {
        return (await this.getNetworkNames()).includes(this.name);
    }
    nodeExists(node_id) {
        for (const net of this.networks) {
            if (net["node_id"] === node_id) {
                return true;
            }
        }
        return false;
    }
    hasAccessPoint(node_id) {
        for (const accessPoint of this.accessPoints) {
            if (node_id === accessPoint.node_id) {
                return true;
            }
        }
        return false;
    }
    async getAccessNodes() {
        if (this._accessNodes.length !== 0) {
            return this._accessNodes;
        }
        const accessNodes = [];
        const nodes = new nodes_1.Nodes(this.config.graphqlURL, this.config.rmbClient["proxyURL"]);
        const allAccessNodes = await nodes.getAccessNodes();
        for (const accessNode of Object.keys(allAccessNodes)) {
            if (this.nodeExists(+accessNode)) {
                accessNodes.push(+accessNode);
            }
        }
        this._accessNodes = accessNodes;
        return accessNodes;
    }
    generateWireguardKeypair() {
        const keypair = tweetnacl_1.default.box.keyPair();
        const wg = new WireGuardKeys();
        wg.privateKey = buffer_1.Buffer.from(keypair.secretKey).toString("base64");
        wg.publicKey = buffer_1.Buffer.from(keypair.publicKey).toString("base64");
        return wg;
    }
    getPublicKey(privateKey) {
        const privKey = buffer_1.Buffer.from(privateKey, "base64");
        const keypair = tweetnacl_1.default.box.keyPair.fromSecretKey(privKey);
        return buffer_1.Buffer.from(keypair.publicKey).toString("base64");
    }
    async getNodeWGPublicKey(node_id) {
        for (const net of this.networks) {
            if (net["node_id"] == node_id) {
                return this.getPublicKey(net.wireguard_private_key);
            }
        }
    }
    getNodeWGListeningPort(node_id) {
        for (const net of this.networks) {
            if (net["node_id"] == node_id) {
                return net.wireguard_listen_port;
            }
        }
    }
    getFreeIP(node_id, subnet = "") {
        let ip;
        if (!this.nodeExists(node_id) && subnet) {
            ip = (0, netaddr_1.Addr)(subnet).mask(32).increment().increment();
        }
        else if (this.nodeExists(node_id)) {
            ip = (0, netaddr_1.Addr)(this.getNodeSubnet(node_id)).mask(32).increment().increment();
            const reserved_ips = this.getNodeReservedIps(node_id);
            while (reserved_ips.includes(ip.toString().split("/")[0])) {
                ip = ip.increment();
            }
        }
        else {
            throw Error("node_id or subnet must be specified");
        }
        if (ip) {
            ip = ip.toString().split("/")[0];
            for (const node of this.nodes) {
                if (node.node_id === node_id) {
                    node.reserved_ips.push(ip);
                    return ip;
                }
            }
            throw Error(`node_id is not in the network. Please add it first`);
        }
    }
    validateUserIP(node_id, ip_address = "") {
        const reserved_ips = this.getNodeReservedIps(node_id);
        if (reserved_ips.includes(ip_address)) {
            throw Error(`private ip ${ip_address} is being used please select another ip or leave it empty`);
        }
        const nodeSubnet = this.getNodeSubnet(node_id);
        const ip = (0, netaddr_1.Addr)(ip_address);
        if (!(0, netaddr_1.Addr)(nodeSubnet).contains(ip)) {
            throw Error(`Selected ip is not available in node subnet, node subnet: ${nodeSubnet}`);
        }
        for (const node of this.nodes) {
            if (node.node_id === node_id) {
                node.reserved_ips.push(ip_address);
                return ip_address;
            }
        }
    }
    getNodeReservedIps(node_id) {
        for (const node of this.nodes) {
            if (node.node_id !== node_id) {
                continue;
            }
            return node.reserved_ips;
        }
        return [];
    }
    deleteReservedIp(node_id, ip) {
        for (const node of this.nodes) {
            if (node.node_id === node_id) {
                node.reserved_ips = node.reserved_ips.filter(item => item !== ip);
            }
        }
        return ip;
    }
    getNodeSubnet(node_id) {
        for (const net of this.networks) {
            if (net["node_id"] === node_id) {
                return net.subnet;
            }
        }
    }
    getReservedSubnets() {
        for (const node of this.nodes) {
            const subnet = this.getNodeSubnet(node.node_id);
            if (subnet && !this.reservedSubnets.includes(subnet)) {
                this.reservedSubnets.push(subnet);
            }
        }
        for (const accessPoint of this.accessPoints) {
            if (accessPoint.subnet && !this.reservedSubnets.includes(accessPoint.subnet)) {
                this.reservedSubnets.push(accessPoint.subnet);
            }
        }
        for (const network of this.networks) {
            if (!this.reservedSubnets.includes(network.subnet)) {
                this.reservedSubnets.push(network.subnet);
            }
        }
        return this.reservedSubnets;
    }
    getFreeSubnet() {
        const reservedSubnets = this.getReservedSubnets();
        let subnet = (0, netaddr_1.Addr)(this.ipRange).mask(24).nextSibling().nextSibling();
        while (reservedSubnets.includes(subnet.toString())) {
            subnet = subnet.nextSibling();
        }
        this.reservedSubnets.push(subnet.toString());
        return subnet.toString();
    }
    ValidateFreeSubnet(subnet) {
        const reservedSubnets = this.getReservedSubnets();
        if (!reservedSubnets.includes(subnet)) {
            this.reservedSubnets.push(subnet);
            return subnet;
        }
        else {
            throw Error(`subnet ${subnet} is not free`);
        }
    }
    async getAccessPoints() {
        const nodesWGPubkeys = [];
        for (const network of this.networks) {
            const pubkey = this.getPublicKey(network.wireguard_private_key);
            nodesWGPubkeys.push(pubkey);
        }
        for (const network of this.networks) {
            for (const peer of network.peers) {
                if (nodesWGPubkeys.includes(peer.wireguard_public_key)) {
                    continue;
                }
                if (peer.endpoint !== "") {
                    continue;
                }
                const accessPoint = new AccessPoint();
                accessPoint.subnet = peer.subnet;
                accessPoint.wireguard_public_key = peer.wireguard_public_key;
                accessPoint.node_id = network["node_id"];
                this.accessPoints.push(accessPoint);
            }
        }
        return this.accessPoints;
    }
    getNetworksPath() {
        return PATH.join(this.config.storePath, "networks");
    }
    async getNetwork() {
        const path = this.getNetworksPath();
        return await this.backendStorage.load(PATH.join(path, this.name, "info.json"));
    }
    async getNetworkNames() {
        const path = this.getNetworksPath();
        return await this.backendStorage.list(path);
    }
    async getFreePort(node_id) {
        const nodes = new nodes_1.Nodes(this.config.graphqlURL, this.config.rmbClient["proxyURL"]);
        const node_twin_id = await nodes.getNodeTwinId(node_id);
        let result;
        try {
            result = await this.rmb.request([node_twin_id], "zos.network.list_wg_ports", "");
        }
        catch (e) {
            throw Error(`Couldn't get free Wireguard ports for node ${node_id} due to ${e}`);
        }
        events_1.events.emit("logs", `Node ${node_id} reserved ports: ${JSON.stringify(result)}`);
        let port = 0;
        while (!port || result.includes(port)) {
            port = (0, utils_1.getRandomNumber)(2000, 8000);
        }
        return port;
    }
    isPrivateIP(ip) {
        return (0, private_ip_1.default)(ip.split("/")[0]);
    }
    async getNodeEndpoint(node_id) {
        if (Object.keys(this._endpoints).includes(String(node_id))) {
            return this._endpoints[node_id];
        }
        const nodes = new nodes_1.Nodes(this.config.graphqlURL, this.config.rmbClient["proxyURL"]);
        const node_twin_id = await nodes.getNodeTwinId(node_id);
        let result;
        try {
            result = await this.rmb.request([node_twin_id], "zos.network.public_config_get", "");
        }
        catch (e) {
            console.log(`Couldn't get public config for node ${node_id} due to ${e}`);
        }
        events_1.events.emit("logs", `Node ${node_id} public config: ${JSON.stringify(result)}`);
        let endpoint;
        if (result) {
            const ipv4 = result.ipv4;
            if (!this.isPrivateIP(ipv4)) {
                endpoint = ipv4.split("/")[0];
            }
            const ipv6 = result.ipv6;
            if (!this.isPrivateIP(ipv6)) {
                endpoint = ipv6.split("/")[0];
            }
        }
        try {
            result = await this.rmb.request([node_twin_id], "zos.network.interfaces", "");
        }
        catch (e) {
            throw Error(`Couldn't get the network interfaces for node ${node_id} due to ${e}`);
        }
        events_1.events.emit("logs", `Node ${node_id} network interfaces: ${JSON.stringify(result)}`);
        if (result) {
            for (const iface of Object.keys(result)) {
                if (iface !== "zos") {
                    continue;
                }
                for (const ip of result[iface]) {
                    if (!this.isPrivateIP(ip)) {
                        endpoint = ip;
                    }
                }
            }
        }
        this._endpoints[node_id] = endpoint;
        return endpoint;
    }
    wgRoutingIP(subnet) {
        const subnetsParts = subnet.split(".");
        return `100.64.${subnetsParts[1]}.${subnetsParts[2].split("/")[0]}/32`;
    }
    getWireguardConfig(subnet, userprivKey, peerPubkey, endpoint) {
        const userIP = this.wgRoutingIP(subnet);
        const networkIP = this.wgRoutingIP(this.ipRange);
        return `[Interface]\nAddress = ${userIP}
PrivateKey = ${userprivKey}\n\n[Peer]\nPublicKey = ${peerPubkey}
AllowedIPs = ${this.ipRange}, ${networkIP}
PersistentKeepalive = 25\nEndpoint = ${endpoint}`;
    }
    async save(contract_id = 0, node_id = 0) {
        let network;
        if (await this.exists()) {
            network = await this.getNetwork();
        }
        else {
            network = {
                ip_range: this.ipRange,
                nodes: [],
            };
        }
        if (this.nodes.length === 0) {
            await this.delete();
            return;
        }
        const nodes = [];
        for (const node of this.nodes) {
            if (!node.contract_id && node.node_id === node_id) {
                node.contract_id = contract_id;
            }
            if (!node.contract_id) {
                continue;
            }
            nodes.push({
                contract_id: node.contract_id,
                node_id: node.node_id,
                reserved_ips: this.getNodeReservedIps(node.node_id),
            });
        }
        network.nodes = nodes;
        if (nodes.length !== 0) {
            await this._save(network);
        }
        else {
            await this.delete();
        }
    }
    async _save(network) {
        const path = PATH.join(this.getNetworksPath(), this.name, "info.json");
        await this.backendStorage.dump(path, network);
    }
    async delete() {
        events_1.events.emit("logs", `Deleting network ${this.name}`);
        const path = PATH.join(this.getNetworksPath(), this.name, "info.json");
        await this.backendStorage.dump(path, "");
    }
    async generatePeers() {
        events_1.events.emit("logs", `Generating peers for network ${this.name}`);
        const hiddenNodeAccessNodesIds = {};
        const hiddenNodes = [];
        for (const net of this.networks) {
            if (this.networks.length === 1) {
                continue;
            }
            const accessIP = await this.getNodeEndpoint(net["node_id"]);
            if (accessIP) {
                continue;
            }
            const accessNodes = await this.getAccessNodes();
            if (accessNodes.length === 0) {
                throw Error(`Couldn't add node ${net["node_id"]} as it's a hidden node ` +
                    `and there is no access node in this network ${this.name}. ` +
                    "Please add addAccess = true in the network configuration.");
            }
            const accessNode = (0, utils_1.randomChoice)(accessNodes);
            hiddenNodeAccessNodesIds[net["node_id"]] = accessNode;
            const hiddenNode = new AccessPoint();
            hiddenNode.node_id = accessNode;
            hiddenNode.subnet = net.subnet;
            hiddenNode.wireguard_public_key = this.getPublicKey(net.wireguard_private_key);
            hiddenNodes.push(hiddenNode);
        }
        const accessPoints = [...this.accessPoints, ...hiddenNodes];
        for (const n of this.networks) {
            n.peers = [];
            for (const net of this.networks) {
                if (n["node_id"] === net["node_id"]) {
                    continue;
                }
                const allowed_ips = [];
                if (Object.keys(hiddenNodeAccessNodesIds).includes(String(n["node_id"]))) {
                    if (net["node_id"] !== +hiddenNodeAccessNodesIds[n["node_id"]]) {
                        continue;
                    }
                    for (const subnet of this.getReservedSubnets()) {
                        if (subnet === n.subnet || subnet === net.subnet) {
                            continue;
                        }
                        allowed_ips.push(subnet);
                        allowed_ips.push(this.wgRoutingIP(subnet));
                    }
                }
                allowed_ips.push(net.subnet);
                allowed_ips.push(this.wgRoutingIP(net.subnet));
                // add access points as allowed ips if this node "net" is the access node and has access point to it
                for (const accessPoint of accessPoints) {
                    if (accessPoint.node_id === net["node_id"]) {
                        if (allowed_ips.includes(accessPoint.subnet)) {
                            continue;
                        }
                        allowed_ips.push(accessPoint.subnet);
                        allowed_ips.push(this.wgRoutingIP(accessPoint.subnet));
                    }
                }
                let accessIP = await this.getNodeEndpoint(net["node_id"]);
                if (!accessIP) {
                    continue;
                }
                if (accessIP.includes(":")) {
                    accessIP = `[${accessIP}]`;
                }
                const peer = new znet_1.Peer();
                peer.subnet = net.subnet;
                peer.wireguard_public_key = this.getPublicKey(net.wireguard_private_key);
                peer.allowed_ips = allowed_ips;
                peer.endpoint = `${accessIP}:${net.wireguard_listen_port}`;
                n.peers.push(peer);
            }
            for (const accessPoint of accessPoints) {
                if (n["node_id"] === accessPoint.node_id) {
                    const allowed_ips = [];
                    allowed_ips.push(accessPoint.subnet);
                    allowed_ips.push(this.wgRoutingIP(accessPoint.subnet));
                    const peer = new znet_1.Peer();
                    peer.subnet = accessPoint.subnet;
                    peer.wireguard_public_key = accessPoint.wireguard_public_key;
                    peer.allowed_ips = allowed_ips;
                    peer.endpoint = "";
                    n.peers.push(peer);
                }
            }
        }
    }
}
exports.Network = Network;
