"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QSFSZDBDeleteModel = exports.QSFSZDBGetModel = exports.QSFSZDBSModel = exports.QSFSDisk = exports.ZOSModel = exports.DeployGatewayNameModel = exports.DeployGatewayFQDNModel = exports.DeleteZDBModel = exports.AddZDBModel = exports.ZDBDeleteModel = exports.ZDBGetModel = exports.ZDBSModel = exports.ZDBModel = exports.DeleteWorkerModel = exports.AddWorkerModel = exports.K8SDeleteModel = exports.K8SGetModel = exports.K8SModel = exports.KubernetesNodeModel = exports.DeleteMachineModel = exports.AddMachineModel = exports.MachinesDeleteModel = exports.MachinesGetModel = exports.MachinesModel = exports.MachineModel = exports.NetworkModel = exports.DiskModel = void 0;
const deployment_1 = require("../zos/deployment");
//TODO: find a way to validate all fields are passed while casting data to any of these classes.
class DiskModel {
    name;
    size; // in GB
    mountpoint;
}
exports.DiskModel = DiskModel;
class QSFSDisk {
    qsfs_zdbs_name;
    name;
    prefix;
    encryption_key;
    mountpoint;
}
exports.QSFSDisk = QSFSDisk;
class NetworkModel {
    name;
    ip_range;
}
exports.NetworkModel = NetworkModel;
class BaseGetDeleteModel {
    name;
}
class MachineModel {
    name;
    node_id;
    disks;
    qsfs_disks;
    public_ip;
    planetary;
    cpu;
    memory; // in MB
    rootfs_size; // in GB
    flist;
    entrypoint;
    env;
}
exports.MachineModel = MachineModel;
class MachinesModel {
    name;
    network;
    machines;
    metadata;
    description;
}
exports.MachinesModel = MachinesModel;
class AddMachineModel extends MachineModel {
    deployment_name;
}
exports.AddMachineModel = AddMachineModel;
class DeleteMachineModel {
    name;
    deployment_name;
}
exports.DeleteMachineModel = DeleteMachineModel;
class MachinesGetModel extends BaseGetDeleteModel {
}
exports.MachinesGetModel = MachinesGetModel;
class MachinesDeleteModel extends BaseGetDeleteModel {
}
exports.MachinesDeleteModel = MachinesDeleteModel;
class KubernetesNodeModel {
    name;
    node_id;
    cpu;
    memory; // in MB
    rootfs_size; // in GB
    disk_size; // in GB
    qsfs_disks;
    public_ip;
    planetary;
}
exports.KubernetesNodeModel = KubernetesNodeModel;
class K8SModel {
    name;
    secret;
    network;
    masters;
    workers;
    metadata;
    description;
    ssh_key;
}
exports.K8SModel = K8SModel;
class K8SGetModel extends BaseGetDeleteModel {
}
exports.K8SGetModel = K8SGetModel;
class K8SDeleteModel extends BaseGetDeleteModel {
}
exports.K8SDeleteModel = K8SDeleteModel;
class AddWorkerModel extends KubernetesNodeModel {
    deployment_name;
}
exports.AddWorkerModel = AddWorkerModel;
class DeleteWorkerModel {
    deployment_name;
    name;
}
exports.DeleteWorkerModel = DeleteWorkerModel;
class ZDBModel {
    name;
    node_id;
    mode;
    disk_size;
    public;
    password;
}
exports.ZDBModel = ZDBModel;
class ZDBSModel {
    name;
    zdbs;
    metadata;
    description;
}
exports.ZDBSModel = ZDBSModel;
class ZDBGetModel extends BaseGetDeleteModel {
}
exports.ZDBGetModel = ZDBGetModel;
class ZDBDeleteModel extends BaseGetDeleteModel {
}
exports.ZDBDeleteModel = ZDBDeleteModel;
class AddZDBModel extends ZDBModel {
    deployment_name;
}
exports.AddZDBModel = AddZDBModel;
class DeleteZDBModel extends DeleteWorkerModel {
}
exports.DeleteZDBModel = DeleteZDBModel;
class QSFSZDBSModel {
    name;
    count;
    node_ids;
    disk_size;
    password;
    metadata;
    description;
}
exports.QSFSZDBSModel = QSFSZDBSModel;
class QSFSZDBGetModel extends BaseGetDeleteModel {
}
exports.QSFSZDBGetModel = QSFSZDBGetModel;
class QSFSZDBDeleteModel extends BaseGetDeleteModel {
}
exports.QSFSZDBDeleteModel = QSFSZDBDeleteModel;
class DeployGatewayFQDNModel {
    name;
    node_id;
    fqdn;
    tls_passthrough;
    backends;
}
exports.DeployGatewayFQDNModel = DeployGatewayFQDNModel;
class DeployGatewayNameModel {
    name;
    node_id;
    tls_passthrough;
    backends;
}
exports.DeployGatewayNameModel = DeployGatewayNameModel;
class ZOSModel extends deployment_1.Deployment {
    node_id;
}
exports.ZOSModel = ZOSModel;
