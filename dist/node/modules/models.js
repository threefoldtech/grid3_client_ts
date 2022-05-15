"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletImportModel = exports.BalanceTransferModel = exports.BalanceGetModel = exports.KVStoreRemoveModel = exports.KVStoreGetModel = exports.KVStoreSetModel = exports.TwinDeleteModel = exports.TwinGetByAccountIdModel = exports.TwinGetModel = exports.TwinCreateModel = exports.ContractConsumption = exports.ContractsByAddress = exports.ContractsByTwinId = exports.ContractCancelModel = exports.NodeContractUpdateModel = exports.NameContractGetModel = exports.ContractGetByNodeIdAndHashModel = exports.ContractGetModel = exports.RentContractDeleteModel = exports.RentContractGetModel = exports.RentContractCreateModel = exports.NameContractCreateModel = exports.NodeContractCreateModel = exports.QSFSZDBDeleteModel = exports.QSFSZDBGetModel = exports.QSFSZDBSModel = exports.QSFSDiskModel = exports.ZOSModel = exports.GatewayNameModel = exports.GatewayFQDNModel = exports.DeleteZDBModel = exports.AddZDBModel = exports.ZDBDeleteModel = exports.ZDBGetModel = exports.ZDBSModel = exports.ZDBModel = exports.DeleteWorkerModel = exports.AddWorkerModel = exports.K8SDeleteModel = exports.K8SGetModel = exports.K8SModel = exports.KubernetesNodeModel = exports.DeleteMachineModel = exports.AddMachineModel = exports.MachinesDeleteModel = exports.MachinesGetModel = exports.MachinesModel = exports.MachineModel = exports.NetworkModel = exports.DiskModel = void 0;
exports.FilterOptions = exports.FarmIdFromFarmNameModel = exports.NodeFreeResourcesModel = exports.NodesByFarmIdModel = exports.FarmHasFreePublicIPsModel = exports.NodesGetModel = exports.FarmsGetModel = exports.GatewayNameDeleteModel = exports.GatewayNameGetModel = exports.GatewayFQDNDeleteModel = exports.GatewayFQDNGetModel = exports.WalletGetModel = exports.WalletDeleteModel = exports.WalletTransferModel = exports.WalletBalanceByAddressModel = exports.WalletBalanceByNameModel = void 0;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const deployment_1 = require("../zos/deployment");
const zdb_1 = require("../zos/zdb");
const NameLength = 15;
//TODO: find a way to validate all fields are passed while casting data to any of these classes.
class DiskModel {
    name;
    size; // in GB
    mountpoint;
}
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsAlphanumeric)(),
    (0, class_validator_1.MaxLength)(NameLength),
    __metadata("design:type", String)
], DiskModel.prototype, "name", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.Min)(0.25),
    __metadata("design:type", Number)
], DiskModel.prototype, "size", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], DiskModel.prototype, "mountpoint", void 0);
exports.DiskModel = DiskModel;
class QSFSDiskModel {
    qsfs_zdbs_name;
    name;
    prefix;
    encryption_key;
    cache; // in GB
    minimal_shards;
    expected_shards;
    mountpoint;
}
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsAlphanumeric)(),
    (0, class_validator_1.MaxLength)(NameLength),
    __metadata("design:type", String)
], QSFSDiskModel.prototype, "qsfs_zdbs_name", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsAlphanumeric)(),
    (0, class_validator_1.MaxLength)(NameLength),
    __metadata("design:type", String)
], QSFSDiskModel.prototype, "name", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], QSFSDiskModel.prototype, "prefix", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], QSFSDiskModel.prototype, "encryption_key", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.Min)(0.25),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], QSFSDiskModel.prototype, "cache", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], QSFSDiskModel.prototype, "minimal_shards", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(2),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], QSFSDiskModel.prototype, "expected_shards", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], QSFSDiskModel.prototype, "mountpoint", void 0);
exports.QSFSDiskModel = QSFSDiskModel;
class NetworkModel {
    name;
    ip_range;
    addAccess;
}
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsAlphanumeric)(),
    (0, class_validator_1.MaxLength)(NameLength),
    __metadata("design:type", String)
], NetworkModel.prototype, "name", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], NetworkModel.prototype, "ip_range", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], NetworkModel.prototype, "addAccess", void 0);
exports.NetworkModel = NetworkModel;
class BaseGetDeleteModel {
    name;
}
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsAlphanumeric)(),
    (0, class_validator_1.MaxLength)(NameLength),
    __metadata("design:type", String)
], BaseGetDeleteModel.prototype, "name", void 0);
class MachineModel {
    name;
    node_id;
    disks;
    qsfs_disks;
    public_ip;
    public_ip6;
    planetary;
    cpu;
    memory; // in MB
    rootfs_size; // in GB
    flist;
    entrypoint;
    env;
    ip;
    corex;
}
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsAlphanumeric)(),
    (0, class_validator_1.MaxLength)(NameLength),
    __metadata("design:type", String)
], MachineModel.prototype, "name", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], MachineModel.prototype, "node_id", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => DiskModel),
    (0, class_validator_1.ValidateNested)({ each: true }),
    __metadata("design:type", Array)
], MachineModel.prototype, "disks", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => QSFSDiskModel),
    (0, class_validator_1.ValidateNested)({ each: true }),
    __metadata("design:type", Array)
], MachineModel.prototype, "qsfs_disks", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], MachineModel.prototype, "public_ip", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], MachineModel.prototype, "public_ip6", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], MachineModel.prototype, "planetary", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], MachineModel.prototype, "cpu", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.Min)(250),
    __metadata("design:type", Number)
], MachineModel.prototype, "memory", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], MachineModel.prototype, "rootfs_size", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsUrl)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], MachineModel.prototype, "flist", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsDefined)(),
    __metadata("design:type", String)
], MachineModel.prototype, "entrypoint", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Object)
], MachineModel.prototype, "env", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIP)(),
    __metadata("design:type", String)
], MachineModel.prototype, "ip", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], MachineModel.prototype, "corex", void 0);
exports.MachineModel = MachineModel;
class MachinesModel {
    name;
    network;
    machines;
    metadata;
    description;
}
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsAlphanumeric)(),
    (0, class_validator_1.MaxLength)(NameLength),
    __metadata("design:type", String)
], MachinesModel.prototype, "name", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_transformer_1.Type)(() => NetworkModel),
    (0, class_validator_1.ValidateNested)(),
    __metadata("design:type", NetworkModel)
], MachinesModel.prototype, "network", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_transformer_1.Type)(() => MachineModel),
    (0, class_validator_1.ValidateNested)({ each: true }),
    __metadata("design:type", Array)
], MachinesModel.prototype, "machines", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], MachinesModel.prototype, "metadata", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], MachinesModel.prototype, "description", void 0);
exports.MachinesModel = MachinesModel;
class AddMachineModel extends MachineModel {
    deployment_name;
}
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsAlphanumeric)(),
    (0, class_validator_1.MaxLength)(NameLength),
    __metadata("design:type", String)
], AddMachineModel.prototype, "deployment_name", void 0);
exports.AddMachineModel = AddMachineModel;
class DeleteMachineModel {
    name;
    deployment_name;
}
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsAlphanumeric)(),
    (0, class_validator_1.MaxLength)(NameLength),
    __metadata("design:type", String)
], DeleteMachineModel.prototype, "name", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsAlphanumeric)(),
    (0, class_validator_1.MaxLength)(NameLength),
    __metadata("design:type", String)
], DeleteMachineModel.prototype, "deployment_name", void 0);
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
    public_ip6;
    planetary;
    ip;
    corex;
}
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsAlphanumeric)(),
    (0, class_validator_1.MaxLength)(NameLength),
    __metadata("design:type", String)
], KubernetesNodeModel.prototype, "name", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], KubernetesNodeModel.prototype, "node_id", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], KubernetesNodeModel.prototype, "cpu", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.Min)(250),
    __metadata("design:type", Number)
], KubernetesNodeModel.prototype, "memory", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], KubernetesNodeModel.prototype, "rootfs_size", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.Min)(0.25),
    __metadata("design:type", Number)
], KubernetesNodeModel.prototype, "disk_size", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => QSFSDiskModel),
    (0, class_validator_1.ValidateNested)({ each: true }),
    __metadata("design:type", Array)
], KubernetesNodeModel.prototype, "qsfs_disks", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], KubernetesNodeModel.prototype, "public_ip", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], KubernetesNodeModel.prototype, "public_ip6", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], KubernetesNodeModel.prototype, "planetary", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIP)(),
    __metadata("design:type", String)
], KubernetesNodeModel.prototype, "ip", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], KubernetesNodeModel.prototype, "corex", void 0);
exports.KubernetesNodeModel = KubernetesNodeModel;
class K8SModel {
    name;
    secret;
    network;
    masters;
    workers;
    metadata;
    description;
    ssh_key; // is not optional as if the user forget it, he will not be able to use the cluster.
}
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsAlphanumeric)(),
    (0, class_validator_1.MaxLength)(NameLength),
    __metadata("design:type", String)
], K8SModel.prototype, "name", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], K8SModel.prototype, "secret", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_transformer_1.Type)(() => NetworkModel),
    (0, class_validator_1.ValidateNested)(),
    __metadata("design:type", NetworkModel)
], K8SModel.prototype, "network", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_transformer_1.Type)(() => KubernetesNodeModel),
    (0, class_validator_1.ValidateNested)({ each: true }),
    __metadata("design:type", Array)
], K8SModel.prototype, "masters", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_transformer_1.Type)(() => KubernetesNodeModel),
    (0, class_validator_1.ValidateNested)({ each: true }),
    __metadata("design:type", Array)
], K8SModel.prototype, "workers", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], K8SModel.prototype, "metadata", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], K8SModel.prototype, "description", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], K8SModel.prototype, "ssh_key", void 0);
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
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsAlphanumeric)(),
    (0, class_validator_1.MaxLength)(NameLength),
    __metadata("design:type", String)
], AddWorkerModel.prototype, "deployment_name", void 0);
exports.AddWorkerModel = AddWorkerModel;
class DeleteWorkerModel {
    deployment_name;
    name;
}
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsAlphanumeric)(),
    (0, class_validator_1.MaxLength)(NameLength),
    __metadata("design:type", String)
], DeleteWorkerModel.prototype, "deployment_name", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsAlphanumeric)(),
    (0, class_validator_1.MaxLength)(NameLength),
    __metadata("design:type", String)
], DeleteWorkerModel.prototype, "name", void 0);
exports.DeleteWorkerModel = DeleteWorkerModel;
class ZDBModel {
    name;
    node_id;
    mode;
    disk_size; // in GB
    publicNamespace;
    password;
}
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsAlphanumeric)(),
    (0, class_validator_1.MaxLength)(NameLength),
    __metadata("design:type", String)
], ZDBModel.prototype, "name", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], ZDBModel.prototype, "node_id", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_transformer_1.Transform)(({ value }) => zdb_1.ZdbModes[value]),
    (0, class_validator_1.IsEnum)(zdb_1.ZdbModes),
    __metadata("design:type", String)
], ZDBModel.prototype, "mode", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.Min)(0.25),
    __metadata("design:type", Number)
], ZDBModel.prototype, "disk_size", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], ZDBModel.prototype, "publicNamespace", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ZDBModel.prototype, "password", void 0);
exports.ZDBModel = ZDBModel;
class ZDBSModel {
    name;
    zdbs;
    metadata;
    description;
}
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsAlphanumeric)(),
    (0, class_validator_1.MaxLength)(NameLength),
    __metadata("design:type", String)
], ZDBSModel.prototype, "name", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_transformer_1.Type)(() => ZDBModel),
    (0, class_validator_1.ValidateNested)({ each: true }),
    __metadata("design:type", Array)
], ZDBSModel.prototype, "zdbs", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ZDBSModel.prototype, "metadata", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ZDBSModel.prototype, "description", void 0);
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
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsAlphanumeric)(),
    (0, class_validator_1.MaxLength)(NameLength),
    __metadata("design:type", String)
], AddZDBModel.prototype, "deployment_name", void 0);
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
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsAlphanumeric)(),
    (0, class_validator_1.MaxLength)(NameLength),
    __metadata("design:type", String)
], QSFSZDBSModel.prototype, "name", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.Min)(3),
    __metadata("design:type", Number)
], QSFSZDBSModel.prototype, "count", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.ArrayNotEmpty)(),
    (0, class_validator_1.IsInt)({ each: true }),
    (0, class_validator_1.Min)(1, { each: true }),
    __metadata("design:type", Array)
], QSFSZDBSModel.prototype, "node_ids", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.Min)(0.25),
    __metadata("design:type", Number)
], QSFSZDBSModel.prototype, "disk_size", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], QSFSZDBSModel.prototype, "password", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], QSFSZDBSModel.prototype, "metadata", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], QSFSZDBSModel.prototype, "description", void 0);
exports.QSFSZDBSModel = QSFSZDBSModel;
class QSFSZDBGetModel extends BaseGetDeleteModel {
}
exports.QSFSZDBGetModel = QSFSZDBGetModel;
class QSFSZDBDeleteModel extends BaseGetDeleteModel {
}
exports.QSFSZDBDeleteModel = QSFSZDBDeleteModel;
class GatewayFQDNModel {
    name;
    node_id;
    fqdn;
    tls_passthrough;
    backends;
}
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsAlphanumeric)(),
    (0, class_validator_1.MaxLength)(NameLength),
    __metadata("design:type", String)
], GatewayFQDNModel.prototype, "name", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], GatewayFQDNModel.prototype, "node_id", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], GatewayFQDNModel.prototype, "fqdn", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], GatewayFQDNModel.prototype, "tls_passthrough", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.ArrayNotEmpty)(),
    (0, class_validator_1.IsUrl)({ protocols: ["http", "https"] }, { each: true }),
    __metadata("design:type", Array)
], GatewayFQDNModel.prototype, "backends", void 0);
exports.GatewayFQDNModel = GatewayFQDNModel;
class GatewayFQDNGetModel extends BaseGetDeleteModel {
}
exports.GatewayFQDNGetModel = GatewayFQDNGetModel;
class GatewayFQDNDeleteModel extends BaseGetDeleteModel {
}
exports.GatewayFQDNDeleteModel = GatewayFQDNDeleteModel;
class BaseGatewayNameModel {
    name;
}
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsAlphanumeric)(),
    __metadata("design:type", String)
], BaseGatewayNameModel.prototype, "name", void 0);
class GatewayNameModel extends BaseGatewayNameModel {
    node_id;
    tls_passthrough;
    backends;
}
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], GatewayNameModel.prototype, "node_id", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], GatewayNameModel.prototype, "tls_passthrough", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.ArrayNotEmpty)(),
    (0, class_validator_1.IsUrl)({ protocols: ["http", "https"] }, { each: true }),
    __metadata("design:type", Array)
], GatewayNameModel.prototype, "backends", void 0);
exports.GatewayNameModel = GatewayNameModel;
class GatewayNameGetModel extends BaseGatewayNameModel {
}
exports.GatewayNameGetModel = GatewayNameGetModel;
class GatewayNameDeleteModel extends BaseGatewayNameModel {
}
exports.GatewayNameDeleteModel = GatewayNameDeleteModel;
class ZOSModel extends deployment_1.Deployment {
    node_id;
}
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], ZOSModel.prototype, "node_id", void 0);
exports.ZOSModel = ZOSModel;
class NodeContractCreateModel {
    node_id;
    hash;
    data;
    public_ip;
}
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], NodeContractCreateModel.prototype, "node_id", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], NodeContractCreateModel.prototype, "hash", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsDefined)(),
    __metadata("design:type", String)
], NodeContractCreateModel.prototype, "data", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], NodeContractCreateModel.prototype, "public_ip", void 0);
exports.NodeContractCreateModel = NodeContractCreateModel;
class NameContractCreateModel {
    name;
}
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsAlphanumeric)(),
    (0, class_validator_1.MaxLength)(NameLength),
    __metadata("design:type", String)
], NameContractCreateModel.prototype, "name", void 0);
exports.NameContractCreateModel = NameContractCreateModel;
class RentContractCreateModel {
    nodeId;
}
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], RentContractCreateModel.prototype, "nodeId", void 0);
exports.RentContractCreateModel = RentContractCreateModel;
class RentContractGetModel {
    nodeId;
}
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], RentContractGetModel.prototype, "nodeId", void 0);
exports.RentContractGetModel = RentContractGetModel;
class RentContractDeleteModel {
    nodeId;
}
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], RentContractDeleteModel.prototype, "nodeId", void 0);
exports.RentContractDeleteModel = RentContractDeleteModel;
class ContractGetModel {
    id;
}
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], ContractGetModel.prototype, "id", void 0);
exports.ContractGetModel = ContractGetModel;
class ContractGetByNodeIdAndHashModel {
    node_id;
    hash;
}
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], ContractGetByNodeIdAndHashModel.prototype, "node_id", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ContractGetByNodeIdAndHashModel.prototype, "hash", void 0);
exports.ContractGetByNodeIdAndHashModel = ContractGetByNodeIdAndHashModel;
class NameContractGetModel {
    name;
}
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsAlphanumeric)(),
    (0, class_validator_1.MaxLength)(NameLength),
    __metadata("design:type", String)
], NameContractGetModel.prototype, "name", void 0);
exports.NameContractGetModel = NameContractGetModel;
class NodeContractUpdateModel {
    id;
    hash;
    data;
}
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], NodeContractUpdateModel.prototype, "id", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], NodeContractUpdateModel.prototype, "hash", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsDefined)(),
    __metadata("design:type", String)
], NodeContractUpdateModel.prototype, "data", void 0);
exports.NodeContractUpdateModel = NodeContractUpdateModel;
class ContractCancelModel {
    id;
}
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], ContractCancelModel.prototype, "id", void 0);
exports.ContractCancelModel = ContractCancelModel;
class ContractsByTwinId {
    twinId;
}
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], ContractsByTwinId.prototype, "twinId", void 0);
exports.ContractsByTwinId = ContractsByTwinId;
class ContractsByAddress {
    address;
}
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ContractsByAddress.prototype, "address", void 0);
exports.ContractsByAddress = ContractsByAddress;
class ContractConsumption {
    id;
}
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], ContractConsumption.prototype, "id", void 0);
exports.ContractConsumption = ContractConsumption;
class TwinCreateModel {
    ip;
}
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], TwinCreateModel.prototype, "ip", void 0);
exports.TwinCreateModel = TwinCreateModel;
class TwinGetModel {
    id;
}
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], TwinGetModel.prototype, "id", void 0);
exports.TwinGetModel = TwinGetModel;
class TwinGetByAccountIdModel {
    public_key;
}
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], TwinGetByAccountIdModel.prototype, "public_key", void 0);
exports.TwinGetByAccountIdModel = TwinGetByAccountIdModel;
class TwinDeleteModel {
    id;
}
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], TwinDeleteModel.prototype, "id", void 0);
exports.TwinDeleteModel = TwinDeleteModel;
class KVStoreSetModel {
    key;
    value;
}
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], KVStoreSetModel.prototype, "key", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], KVStoreSetModel.prototype, "value", void 0);
exports.KVStoreSetModel = KVStoreSetModel;
class KVStoreGetModel {
    key;
}
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], KVStoreGetModel.prototype, "key", void 0);
exports.KVStoreGetModel = KVStoreGetModel;
class KVStoreRemoveModel {
    key;
}
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], KVStoreRemoveModel.prototype, "key", void 0);
exports.KVStoreRemoveModel = KVStoreRemoveModel;
class BalanceGetModel {
    address;
}
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], BalanceGetModel.prototype, "address", void 0);
exports.BalanceGetModel = BalanceGetModel;
class BalanceTransferModel {
    address;
    amount;
}
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], BalanceTransferModel.prototype, "address", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.Min)(0.0000001),
    __metadata("design:type", Number)
], BalanceTransferModel.prototype, "amount", void 0);
exports.BalanceTransferModel = BalanceTransferModel;
class WalletImportModel {
    name;
    secret;
}
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsAlphanumeric)(),
    (0, class_validator_1.MaxLength)(NameLength),
    __metadata("design:type", String)
], WalletImportModel.prototype, "name", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], WalletImportModel.prototype, "secret", void 0);
exports.WalletImportModel = WalletImportModel;
class WalletBalanceByNameModel {
    name;
}
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsAlphanumeric)(),
    (0, class_validator_1.MaxLength)(NameLength),
    __metadata("design:type", String)
], WalletBalanceByNameModel.prototype, "name", void 0);
exports.WalletBalanceByNameModel = WalletBalanceByNameModel;
class WalletBalanceByAddressModel {
    address;
}
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], WalletBalanceByAddressModel.prototype, "address", void 0);
exports.WalletBalanceByAddressModel = WalletBalanceByAddressModel;
class WalletTransferModel {
    name;
    target_address;
    amount;
    asset;
    memo;
}
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsAlphanumeric)(),
    (0, class_validator_1.MaxLength)(NameLength),
    __metadata("design:type", String)
], WalletTransferModel.prototype, "name", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], WalletTransferModel.prototype, "target_address", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.Min)(0.0000001),
    __metadata("design:type", Number)
], WalletTransferModel.prototype, "amount", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], WalletTransferModel.prototype, "asset", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], WalletTransferModel.prototype, "memo", void 0);
exports.WalletTransferModel = WalletTransferModel;
class WalletDeleteModel {
    name;
}
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsAlphanumeric)(),
    (0, class_validator_1.MaxLength)(NameLength),
    __metadata("design:type", String)
], WalletDeleteModel.prototype, "name", void 0);
exports.WalletDeleteModel = WalletDeleteModel;
class WalletGetModel extends WalletDeleteModel {
}
exports.WalletGetModel = WalletGetModel;
class FarmsGetModel {
    page; // default 1
    maxResult; // default 50
}
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], FarmsGetModel.prototype, "page", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], FarmsGetModel.prototype, "maxResult", void 0);
exports.FarmsGetModel = FarmsGetModel;
class NodesGetModel extends FarmsGetModel {
}
exports.NodesGetModel = NodesGetModel;
class FarmHasFreePublicIPsModel {
    farmId;
}
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], FarmHasFreePublicIPsModel.prototype, "farmId", void 0);
exports.FarmHasFreePublicIPsModel = FarmHasFreePublicIPsModel;
class NodesByFarmIdModel extends FarmHasFreePublicIPsModel {
}
exports.NodesByFarmIdModel = NodesByFarmIdModel;
class NodeFreeResourcesModel {
    nodeId;
}
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], NodeFreeResourcesModel.prototype, "nodeId", void 0);
exports.NodeFreeResourcesModel = NodeFreeResourcesModel;
class FarmIdFromFarmNameModel {
    farmName;
}
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], FarmIdFromFarmNameModel.prototype, "farmName", void 0);
exports.FarmIdFromFarmNameModel = FarmIdFromFarmNameModel;
class FilterOptions {
    cru;
    mru; // GB
    sru; // GB
    hru; // GB
    publicIPs;
    accessNodeV4;
    accessNodeV6;
    gateway;
    farmId;
    farmName;
    country;
    city;
    dedicated;
    availableFor;
}
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], FilterOptions.prototype, "cru", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], FilterOptions.prototype, "mru", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], FilterOptions.prototype, "sru", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], FilterOptions.prototype, "hru", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], FilterOptions.prototype, "publicIPs", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], FilterOptions.prototype, "accessNodeV4", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], FilterOptions.prototype, "accessNodeV6", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], FilterOptions.prototype, "gateway", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], FilterOptions.prototype, "farmId", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FilterOptions.prototype, "farmName", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FilterOptions.prototype, "country", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FilterOptions.prototype, "city", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], FilterOptions.prototype, "dedicated", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], FilterOptions.prototype, "availableFor", void 0);
exports.FilterOptions = FilterOptions;
