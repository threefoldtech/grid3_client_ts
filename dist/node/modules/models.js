"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZOS = exports.DeployGatewayName = exports.DeployGatewayFQDN = exports.WalletGet = exports.WalletDelete = exports.WalletTransfer = exports.WalletBalanceByAddress = exports.WalletBalanceByName = exports.WalletImport = exports.TwinDelete = exports.TwinGet = exports.TwinCreate = exports.ContractCancel = exports.NodeContractUpdate = exports.ContractGet = exports.NameContractCreate = exports.NodeContractCreate = exports.DeleteZDB = exports.AddZDB = exports.ZDBDelete = exports.ZDBGet = exports.ZDBS = exports.DeleteWorker = exports.AddWorker = exports.K8SDelete = exports.K8SGet = exports.K8S = exports.MachinesDelete = exports.MachinesGet = exports.Machines = exports.VirtualMachineDisk = void 0;
const deployment_1 = require("../zos/deployment");
class VirtualMachineDisk {
    name;
    size;
    mountpoint;
}
exports.VirtualMachineDisk = VirtualMachineDisk;
;
class Network {
    name;
    ip_range;
}
class BaseGetDelete {
    name;
}
class Machines {
    name;
    node_id;
    disks;
    network;
    public_ip;
    cpu;
    memory;
    flist;
    entrypoint;
    metadata;
    description;
    env;
}
exports.Machines = Machines;
class MachinesGet extends BaseGetDelete {
}
exports.MachinesGet = MachinesGet;
class MachinesDelete extends BaseGetDelete {
}
exports.MachinesDelete = MachinesDelete;
class KubernetesNode {
    name;
    node_id;
    cpu;
    memory;
    disk_size;
    public_ip;
}
class K8S {
    name;
    secret;
    network;
    masters;
    workers;
    metadata;
    description;
    ssh_key;
}
exports.K8S = K8S;
class K8SGet extends BaseGetDelete {
}
exports.K8SGet = K8SGet;
class K8SDelete extends BaseGetDelete {
}
exports.K8SDelete = K8SDelete;
class AddWorker extends KubernetesNode {
    deployment_name;
}
exports.AddWorker = AddWorker;
class DeleteWorker {
    deployment_name;
    name;
}
exports.DeleteWorker = DeleteWorker;
class ZDB {
    name;
    node_id;
    mode;
    disk_size;
    disk_type;
    public;
    namespace;
    password;
}
class ZDBS {
    name;
    zdbs;
    metadata;
    description;
}
exports.ZDBS = ZDBS;
class ZDBGet extends BaseGetDelete {
}
exports.ZDBGet = ZDBGet;
class ZDBDelete extends BaseGetDelete {
}
exports.ZDBDelete = ZDBDelete;
class AddZDB extends ZDB {
    deployment_name;
}
exports.AddZDB = AddZDB;
class DeleteZDB extends DeleteWorker {
}
exports.DeleteZDB = DeleteZDB;
class NodeContractCreate {
    node_id;
    hash;
    data;
    public_ip;
}
exports.NodeContractCreate = NodeContractCreate;
class NameContractCreate {
    name;
}
exports.NameContractCreate = NameContractCreate;
class ContractGet {
    id;
}
exports.ContractGet = ContractGet;
class NodeContractUpdate {
    id;
    hash;
    data;
}
exports.NodeContractUpdate = NodeContractUpdate;
class ContractCancel {
    id;
}
exports.ContractCancel = ContractCancel;
class TwinCreate {
    ip;
}
exports.TwinCreate = TwinCreate;
class TwinGet {
    id;
}
exports.TwinGet = TwinGet;
class TwinDelete {
    id;
}
exports.TwinDelete = TwinDelete;
class WalletImport {
    name;
    secret;
}
exports.WalletImport = WalletImport;
class WalletBalanceByName {
    name;
}
exports.WalletBalanceByName = WalletBalanceByName;
class WalletBalanceByAddress {
    address;
}
exports.WalletBalanceByAddress = WalletBalanceByAddress;
class WalletTransfer {
    name;
    target_address;
    amount;
    asset;
    memo;
}
exports.WalletTransfer = WalletTransfer;
class WalletDelete {
    name;
}
exports.WalletDelete = WalletDelete;
class WalletGet extends WalletDelete {
}
exports.WalletGet = WalletGet;
class DeployGatewayFQDN {
    name;
    node_id;
    fqdn;
    tls_passthrough;
    backends;
}
exports.DeployGatewayFQDN = DeployGatewayFQDN;
class DeployGatewayName {
    name;
    node_id;
    tls_passthrough;
    backends;
}
exports.DeployGatewayName = DeployGatewayName;
class ZOS extends deployment_1.Deployment {
    node_id;
}
exports.ZOS = ZOS;
