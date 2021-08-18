"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var znet_1 = require("./zos/znet");
var zmount_1 = require("./zos/zmount");
var zmachine_1 = require("./zos/zmachine");
var computecapacity_1 = require("./zos/computecapacity");
var workload_1 = require("./zos/workload");
var deployment_1 = require("./zos/deployment");
var client_1 = require("./tf-grid/client");
var client_2 = require("./rmb-client/client");
function main() {
    return __awaiter(this, void 0, void 0, function () {
        function deploy() {
            return __awaiter(this, void 0, void 0, function () {
                function callback(data) {
                    console.log(data);
                    deployment.contract_id = data["contract_id"];
                    var payload = JSON.stringify(deployment);
                    console.log("payload>>>>>>>>>>>>>>>>>>", payload);
                    var rmb = new client_2.MessageBusClient(6379);
                    var msg = rmb.prepare("zos.deployment.deploy", [node_twin_id], 0, 2);
                    rmb.send(msg, payload);
                    rmb.read(msg, function (result) {
                        console.log("result received");
                        console.log(result);
                    });
                }
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, tf_client.contracts.createContract(node_id, deployment.challenge_hash(), "", 0, callback)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        }
        function update() {
            return __awaiter(this, void 0, void 0, function () {
                var payload, rmb, msg;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, tf_client.contracts.updateContract(contract_id, "", deployment.challenge_hash())];
                        case 1:
                            _a.sent();
                            deployment.contract_id = contract_id;
                            payload = JSON.stringify(deployment);
                            console.log("payload>>>>>>>>>>>>>>>>>>", payload);
                            rmb = new client_2.MessageBusClient(6379);
                            msg = rmb.prepare("zos.deployment.update", [node_twin_id], 0, 2);
                            rmb.send(msg, payload);
                            rmb.read(msg, function (result) {
                                console.log("result received");
                                console.log(result);
                            });
                            return [2 /*return*/];
                    }
                });
            });
        }
        var zmount, zmount_workload, peer, znet, znet_workload, mount, znetwork_interface, zmachine_network, compute_capacity, zmachine, zmachine_workload, signature_request, signature_requirement, deployment, mnemonic, url, payload, node_id, node_twin_id, contract_id, tf_client;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    zmount = new zmount_1.Zmount();
                    zmount.size = 1024 * 1024 * 1024 * 10;
                    zmount_workload = new workload_1.Workload();
                    zmount_workload.version = 0;
                    zmount_workload.name = "zmountiaia";
                    zmount_workload.type = workload_1.WorkloadTypes.zmount;
                    zmount_workload.data = zmount;
                    zmount_workload.metadata = "zm";
                    zmount_workload.description = "zm test";
                    peer = new znet_1.Peer();
                    peer.subnet = "10.242.2.0/24";
                    peer.wireguard_public_key = "cEzVprB7IdpLaWZqYOsCndGJ5MBgv1q1lTFG1B2Czkc=";
                    peer.allowed_ips = ["10.242.2.0/24", "100.64.242.2/32"];
                    znet = new znet_1.Znet();
                    znet.subnet = "10.242.1.0/24";
                    znet.ip_range = "10.242.0.0/16";
                    znet.wireguard_private_key = "SDtQFBHzYTu/c7dt/X1VDZeGmXmE7TD6nQC5tp4wv38=";
                    znet.wireguard_listen_port = 7821;
                    znet.peers = [peer];
                    znet_workload = new workload_1.Workload();
                    znet_workload.version = 0;
                    znet_workload.name = "testznetwork";
                    znet_workload.type = workload_1.WorkloadTypes.network;
                    znet_workload.data = znet;
                    znet_workload.metadata = "zn";
                    znet_workload.description = "zn test";
                    mount = new zmachine_1.Mount();
                    mount.name = "zmountiaia";
                    mount.mountpoint = "/mydisk";
                    znetwork_interface = new zmachine_1.ZNetworkInterface();
                    znetwork_interface.network = "testznetwork";
                    znetwork_interface.ip = "10.242.1.5";
                    zmachine_network = new zmachine_1.ZmachineNetwork();
                    zmachine_network.planetary = true;
                    zmachine_network.interfaces = [znetwork_interface];
                    compute_capacity = new computecapacity_1.ComputeCapacity();
                    compute_capacity.cpu = 1;
                    compute_capacity.memory = 1024 * 1024 * 1024 * 2;
                    zmachine = new zmachine_1.Zmachine();
                    zmachine.flist = "https://hub.grid.tf/tf-official-apps/base:latest.flist";
                    zmachine.network = zmachine_network;
                    zmachine.size = 1;
                    zmachine.mounts = [mount];
                    zmachine.entrypoint = "/sbin/zinit init";
                    zmachine.compute_capacity = compute_capacity;
                    zmachine.env = { "SSH_KEY": "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQDmm8OzLt+lTdGaMUwMFcw0P+vr+a/h/UsR//EzzeQsgNtC0bdls4MawVEhb3hNcycEQNd2P/+tXdLC4qcaJ6iABYip4xqqAeY098owGDYhUKYwmnMyo+NwSgpjZs8taOhMxh5XHRI+Ifr4l/GmzbqExS0KVD21PI+4sdiLspbcnVBlg9Eg9enM///zx6rSkulrca/+MnSYHboC5+y4XLYboArD/gpWy3zwIUyxX/1MjJwPeSnd5LFBIWvPGrm3cl+dAtADwTZRkt5Yuet8y5HI73Q5/NSlCdYXMtlsKBLpJu3Ar8nz1QfSQL7dB8pa7/sf/s8wO17rXqWQgZG6JzvZ root@ahmed-Inspiron-3576" };
                    zmachine_workload = new workload_1.Workload();
                    zmachine_workload.version = 0;
                    zmachine_workload.name = "testzmachine";
                    zmachine_workload.type = workload_1.WorkloadTypes.zmachine;
                    zmachine_workload.data = zmachine;
                    zmachine_workload.metadata = "zmachine";
                    zmachine_workload.description = "zmachine test";
                    signature_request = new deployment_1.SignatureRequest();
                    signature_request.twin_id = 10;
                    signature_request.weight = 1;
                    signature_requirement = new deployment_1.SignatureRequirement();
                    signature_requirement.weight_required = 1;
                    signature_requirement.requests = [signature_request];
                    deployment = new deployment_1.Deployment();
                    deployment.version = 0;
                    deployment.twin_id = 10;
                    deployment.expiration = 1626394539;
                    deployment.metadata = "zm dep";
                    deployment.description = "zm test";
                    deployment.workloads = [zmount_workload, znet_workload, zmachine_workload];
                    deployment.signature_requirement = signature_requirement;
                    mnemonic = "false boss tape wish talent pool ghost token exhibit response hedgehog invite";
                    url = "wss://explorer.devnet.grid.tf/ws";
                    console.log(deployment.challenge_hash());
                    console.log(deployment.challenge());
                    deployment.sign(10, mnemonic);
                    payload = JSON.stringify(deployment);
                    console.log("payload>>>>>>>>>>>>>>>>>>", payload);
                    node_id = 2;
                    node_twin_id = 3;
                    contract_id = 49;
                    tf_client = new client_1.TFClient(url, mnemonic);
                    return [4 /*yield*/, tf_client.connect()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
main();
