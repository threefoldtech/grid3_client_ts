"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZOS = exports.DeployGatewayName = exports.DeployGatewayFQDN = exports.DeleteZDB = exports.AddZDB = exports.ZDBDelete = exports.ZDBGet = exports.ZDBS = exports.DeleteWorker = exports.AddWorker = exports.K8SDelete = exports.K8SGet = exports.K8S = exports.KubernetesNode = exports.MachinesDelete = exports.MachinesGet = exports.Machines = exports.VirtualMachineDisk = void 0;
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
exports.KubernetesNode = KubernetesNode;
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
