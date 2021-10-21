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
exports.Network = void 0;
const PATH = __importStar(require("path"));
const tweetnacl_1 = __importDefault(require("tweetnacl"));
const buffer_1 = require("buffer");
const class_transformer_1 = require("class-transformer");
const netaddr_1 = require("netaddr");
const ip_1 = __importDefault(require("ip"));
const workload_1 = require("../zos/workload");
const znet_1 = require("../zos/znet");
const jsonfs_1 = require("../helpers/jsonfs");
const utils_1 = require("../helpers/utils");
const nodes_1 = require("./nodes");
const events_1 = require("../helpers/events");
class WireGuardKeys {
    privateKey;
    publicKey;
}
class Node {
    node_id;
    contract_id;
    reserved_ips = [];
}
class AccessPoint {
    subnet;
    wireguard_public_key;
    node_id;
}
class Network {
    name;
    ipRange;
    rmbClient;
    storePath;
    nodes = [];
    deployments = [];
    reservedSubnets = [];
    networks = [];
    accessPoints = [];
    constructor(name, ipRange, rmbClient, storePath) {
        this.name = name;
        this.ipRange = ipRange;
        this.rmbClient = rmbClient;
        this.storePath = storePath;
        if ((0, netaddr_1.Addr)(ipRange).prefix !== 16) {
            throw Error("Network ip_range should be with prefix 16");
        }
        if (!this.isPrivateIP(ipRange)) {
            throw Error("Network ip_range should be private range");
        }
    }
    async addAccess(node_id, ipv4) {
        if (!this.nodeExists(node_id)) {
            throw Error(`Node ${node_id} does not exist in the network. Please add it first`);
        }
        events_1.events.emit("logs", `Adding access to node ${node_id}`);
        const accessNodes = await (0, nodes_1.getAccessNodes)();
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
            throw Error(`Couldn't find ipv4 or ipv6 in the node ${node_id} public config`);
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
    async addNode(node_id, metadata = "", description = "") {
        if (this.nodeExists(node_id)) {
            return;
        }
        events_1.events.emit("logs", `Adding node ${node_id} to network ${this.name}`);
        const keypair = this.generateWireguardKeypair();
        let znet = new znet_1.Znet();
        znet.subnet = this.getFreeSubnet();
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
    deleteNode(node_id) {
        if (!this.exists()) {
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
    async load(deployments = false) {
        const networks = this.getNetworks();
        if (!Object.keys(networks).includes(this.name)) {
            return;
        }
        events_1.events.emit("logs", `Loading network ${this.name}`);
        const network = networks[this.name];
        if (network.ip_range !== this.ipRange) {
            throw Error(`The same network name ${this.name} with different ip range is already exist`);
        }
        for (const node of network.nodes) {
            const n = node;
            this.nodes.push(n);
        }
        if (deployments) {
            for (const node of this.nodes) {
                const node_twin_id = await (0, nodes_1.getNodeTwinId)(node.node_id);
                const msg = this.rmbClient.prepare("zos.deployment.get", [node_twin_id], 0, 2);
                const message = await this.rmbClient.send(msg, JSON.stringify({ contract_id: node.contract_id }));
                const result = await this.rmbClient.read(message);
                if (result[0].err) {
                    console.error(`Could not load network deployment ${node.contract_id} due to error: ${result[0].err} `);
                }
                const res = JSON.parse(result[0].dat);
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
                    this.networks.push(znet);
                    this.deployments.push(res);
                }
            }
            await this.getAccessPoints();
            this.save();
        }
    }
    _fromObj(net) {
        const znet = (0, class_transformer_1.plainToClass)(znet_1.Znet, net);
        return znet;
    }
    exists() {
        return this.getNetworkNames().includes(this.name);
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
                const accessPoint = new AccessPoint();
                accessPoint.subnet = peer.subnet;
                accessPoint.wireguard_public_key = peer.wireguard_public_key;
                accessPoint.node_id = network["node_id"];
                this.accessPoints.push(accessPoint);
            }
        }
        return this.accessPoints;
    }
    getNetworks() {
        const path = PATH.join(this.storePath, "network.json");
        return (0, jsonfs_1.loadFromFile)(path);
    }
    getNetworkNames() {
        const networks = this.getNetworks();
        return Object.keys(networks);
    }
    async getFreePort(node_id) {
        const node_twin_id = await (0, nodes_1.getNodeTwinId)(node_id);
        const msg = this.rmbClient.prepare("zos.network.list_wg_ports", [node_twin_id], 0, 2);
        const message = await this.rmbClient.send(msg, "");
        const result = await this.rmbClient.read(message);
        events_1.events.emit("logs", result);
        let port = 0;
        while (!port || JSON.parse(result[0].dat).includes(port)) {
            port = (0, utils_1.getRandomNumber)(2000, 8000);
        }
        return port;
    }
    isPrivateIP(ip) {
        return ip_1.default.isPrivate(ip.split("/")[0]);
    }
    async getNodeEndpoint(node_id) {
        const node_twin_id = await (0, nodes_1.getNodeTwinId)(node_id);
        let msg = this.rmbClient.prepare("zos.network.public_config_get", [node_twin_id], 0, 2);
        let message = await this.rmbClient.send(msg, "");
        let result = await this.rmbClient.read(message);
        events_1.events.emit("logs", result);
        if (!result[0].err && result[0].dat) {
            const data = JSON.parse(result[0].dat);
            const ipv4 = data.ipv4;
            if (!this.isPrivateIP(ipv4)) {
                return ipv4.split("/")[0];
            }
            const ipv6 = data.ipv6;
            if (!this.isPrivateIP(ipv6)) {
                return ipv6.split("/")[0];
            }
        }
        events_1.events.emit("logs", `node ${node_id} has no public config`);
        msg = this.rmbClient.prepare("zos.network.interfaces", [node_twin_id], 0, 2);
        message = await this.rmbClient.send(msg, "");
        result = await this.rmbClient.read(message);
        events_1.events.emit("logs", result);
        if (!result[0].err && result[0].dat) {
            const data = JSON.parse(result[0].dat);
            for (const iface of Object.keys(data)) {
                if (iface !== "zos") {
                    continue;
                }
                for (const ip of data[iface]) {
                    if (!this.isPrivateIP(ip)) {
                        return ip;
                    }
                }
            }
        }
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
    save(contract_id = 0, node_id = 0) {
        let network;
        if (this.exists()) {
            network = this.getNetworks()[this.name];
        }
        else {
            network = {
                ip_range: this.ipRange,
                nodes: [],
            };
        }
        if (this.nodes.length === 0) {
            this.delete();
            return;
        }
        const nodes = [];
        for (const node of this.nodes) {
            if (node.node_id === node_id) {
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
        this._save(network);
    }
    _save(network) {
        const networks = this.getNetworks();
        networks[this.name] = network;
        const path = PATH.join(this.storePath, "network.json");
        (0, jsonfs_1.dumpToFile)(path, networks);
    }
    delete() {
        events_1.events.emit("logs", `Deleting network ${this.name}`);
        const networks = this.getNetworks();
        delete networks[this.name];
        const path = PATH.join(this.storePath, "network.json");
        (0, jsonfs_1.dumpToFile)(path, networks);
    }
    async generatePeers() {
        events_1.events.emit("logs", `Generating peers for network ${this.name}`);
        for (const n of this.networks) {
            n.peers = [];
            for (const net of this.networks) {
                if (n["node_id"] === net["node_id"]) {
                    continue;
                }
                const allowed_ips = [];
                allowed_ips.push(net.subnet);
                allowed_ips.push(this.wgRoutingIP(net.subnet));
                // add access points as allowed ips if this node "net" is the access node and has access point to it
                for (const accessPoint of this.accessPoints) {
                    if (accessPoint.node_id === net["node_id"]) {
                        allowed_ips.push(accessPoint.subnet);
                        allowed_ips.push(this.wgRoutingIP(accessPoint.subnet));
                    }
                }
                let accessIP = await this.getNodeEndpoint(net["node_id"]);
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
            for (const accessPoint of this.accessPoints) {
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
