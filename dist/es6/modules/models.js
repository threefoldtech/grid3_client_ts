var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Expose, Transform, Type } from "class-transformer";
import { ArrayNotEmpty, IsAlphanumeric, IsBoolean, IsDefined, IsEnum, IsInt, IsIP, IsNotEmpty, IsOptional, IsString, IsUrl, MaxLength, Min, ValidateNested, } from "class-validator";
import { Deployment } from "../zos/deployment";
import { ZdbModes } from "../zos/zdb";
const NameLength = 15;
//TODO: find a way to validate all fields are passed while casting data to any of these classes.
class DiskModel {
}
__decorate([
    Expose(),
    IsString(),
    IsNotEmpty(),
    IsAlphanumeric(),
    MaxLength(NameLength),
    __metadata("design:type", String)
], DiskModel.prototype, "name", void 0);
__decorate([
    Expose(),
    Min(0.25),
    __metadata("design:type", Number)
], DiskModel.prototype, "size", void 0);
__decorate([
    Expose(),
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], DiskModel.prototype, "mountpoint", void 0);
class QSFSDiskModel {
}
__decorate([
    Expose(),
    IsString(),
    IsNotEmpty(),
    IsAlphanumeric(),
    MaxLength(NameLength),
    __metadata("design:type", String)
], QSFSDiskModel.prototype, "qsfs_zdbs_name", void 0);
__decorate([
    Expose(),
    IsString(),
    IsNotEmpty(),
    IsAlphanumeric(),
    MaxLength(NameLength),
    __metadata("design:type", String)
], QSFSDiskModel.prototype, "name", void 0);
__decorate([
    Expose(),
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], QSFSDiskModel.prototype, "prefix", void 0);
__decorate([
    Expose(),
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], QSFSDiskModel.prototype, "encryption_key", void 0);
__decorate([
    Expose(),
    Min(0.25),
    IsOptional(),
    __metadata("design:type", Number)
], QSFSDiskModel.prototype, "cache", void 0);
__decorate([
    Expose(),
    IsInt(),
    Min(1),
    IsOptional(),
    __metadata("design:type", Number)
], QSFSDiskModel.prototype, "minimal_shards", void 0);
__decorate([
    Expose(),
    IsInt(),
    Min(2),
    IsOptional(),
    __metadata("design:type", Number)
], QSFSDiskModel.prototype, "expected_shards", void 0);
__decorate([
    Expose(),
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], QSFSDiskModel.prototype, "mountpoint", void 0);
class NetworkModel {
}
__decorate([
    Expose(),
    IsString(),
    IsNotEmpty(),
    IsAlphanumeric(),
    MaxLength(NameLength),
    __metadata("design:type", String)
], NetworkModel.prototype, "name", void 0);
__decorate([
    Expose(),
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], NetworkModel.prototype, "ip_range", void 0);
__decorate([
    Expose(),
    IsBoolean(),
    IsOptional(),
    __metadata("design:type", Boolean)
], NetworkModel.prototype, "addAccess", void 0);
class BaseGetDeleteModel {
}
__decorate([
    Expose(),
    IsString(),
    IsNotEmpty(),
    IsAlphanumeric(),
    MaxLength(NameLength),
    __metadata("design:type", String)
], BaseGetDeleteModel.prototype, "name", void 0);
class MachineModel {
}
__decorate([
    Expose(),
    IsString(),
    IsNotEmpty(),
    IsAlphanumeric(),
    MaxLength(NameLength),
    __metadata("design:type", String)
], MachineModel.prototype, "name", void 0);
__decorate([
    Expose(),
    IsInt(),
    Min(1),
    __metadata("design:type", Number)
], MachineModel.prototype, "node_id", void 0);
__decorate([
    Expose(),
    IsOptional(),
    Type(() => DiskModel),
    ValidateNested({ each: true }),
    __metadata("design:type", Array)
], MachineModel.prototype, "disks", void 0);
__decorate([
    Expose(),
    IsOptional(),
    Type(() => QSFSDiskModel),
    ValidateNested({ each: true }),
    __metadata("design:type", Array)
], MachineModel.prototype, "qsfs_disks", void 0);
__decorate([
    Expose(),
    IsBoolean(),
    __metadata("design:type", Boolean)
], MachineModel.prototype, "public_ip", void 0);
__decorate([
    Expose(),
    IsOptional(),
    IsBoolean(),
    __metadata("design:type", Boolean)
], MachineModel.prototype, "public_ip6", void 0);
__decorate([
    Expose(),
    IsBoolean(),
    __metadata("design:type", Boolean)
], MachineModel.prototype, "planetary", void 0);
__decorate([
    Expose(),
    IsInt(),
    Min(1),
    __metadata("design:type", Number)
], MachineModel.prototype, "cpu", void 0);
__decorate([
    Expose(),
    Min(250),
    __metadata("design:type", Number)
], MachineModel.prototype, "memory", void 0);
__decorate([
    Expose(),
    __metadata("design:type", Number)
], MachineModel.prototype, "rootfs_size", void 0);
__decorate([
    Expose(),
    IsUrl(),
    IsNotEmpty(),
    __metadata("design:type", String)
], MachineModel.prototype, "flist", void 0);
__decorate([
    Expose(),
    IsString(),
    IsDefined(),
    __metadata("design:type", String)
], MachineModel.prototype, "entrypoint", void 0);
__decorate([
    Expose(),
    __metadata("design:type", Object)
], MachineModel.prototype, "env", void 0);
__decorate([
    Expose(),
    IsOptional(),
    IsIP(),
    __metadata("design:type", String)
], MachineModel.prototype, "ip", void 0);
__decorate([
    Expose(),
    IsOptional(),
    IsBoolean(),
    __metadata("design:type", Boolean)
], MachineModel.prototype, "corex", void 0);
class MachinesModel {
}
__decorate([
    Expose(),
    IsString(),
    IsNotEmpty(),
    IsAlphanumeric(),
    MaxLength(NameLength),
    __metadata("design:type", String)
], MachinesModel.prototype, "name", void 0);
__decorate([
    Expose(),
    Type(() => NetworkModel),
    ValidateNested(),
    __metadata("design:type", NetworkModel)
], MachinesModel.prototype, "network", void 0);
__decorate([
    Expose(),
    Type(() => MachineModel),
    ValidateNested({ each: true }),
    __metadata("design:type", Array)
], MachinesModel.prototype, "machines", void 0);
__decorate([
    Expose(),
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], MachinesModel.prototype, "metadata", void 0);
__decorate([
    Expose(),
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], MachinesModel.prototype, "description", void 0);
class AddMachineModel extends MachineModel {
}
__decorate([
    Expose(),
    IsString(),
    IsNotEmpty(),
    IsAlphanumeric(),
    MaxLength(NameLength),
    __metadata("design:type", String)
], AddMachineModel.prototype, "deployment_name", void 0);
class DeleteMachineModel {
}
__decorate([
    Expose(),
    IsString(),
    IsNotEmpty(),
    IsAlphanumeric(),
    MaxLength(NameLength),
    __metadata("design:type", String)
], DeleteMachineModel.prototype, "name", void 0);
__decorate([
    Expose(),
    IsString(),
    IsNotEmpty(),
    IsAlphanumeric(),
    MaxLength(NameLength),
    __metadata("design:type", String)
], DeleteMachineModel.prototype, "deployment_name", void 0);
class MachinesGetModel extends BaseGetDeleteModel {
}
class MachinesDeleteModel extends BaseGetDeleteModel {
}
class KubernetesNodeModel {
}
__decorate([
    Expose(),
    IsString(),
    IsNotEmpty(),
    IsAlphanumeric(),
    MaxLength(NameLength),
    __metadata("design:type", String)
], KubernetesNodeModel.prototype, "name", void 0);
__decorate([
    Expose(),
    IsInt(),
    Min(1),
    __metadata("design:type", Number)
], KubernetesNodeModel.prototype, "node_id", void 0);
__decorate([
    Expose(),
    IsInt(),
    Min(1),
    __metadata("design:type", Number)
], KubernetesNodeModel.prototype, "cpu", void 0);
__decorate([
    Expose(),
    Min(250),
    __metadata("design:type", Number)
], KubernetesNodeModel.prototype, "memory", void 0);
__decorate([
    Expose(),
    __metadata("design:type", Number)
], KubernetesNodeModel.prototype, "rootfs_size", void 0);
__decorate([
    Expose(),
    Min(0.25),
    __metadata("design:type", Number)
], KubernetesNodeModel.prototype, "disk_size", void 0);
__decorate([
    Expose(),
    IsOptional(),
    Type(() => QSFSDiskModel),
    ValidateNested({ each: true }),
    __metadata("design:type", Array)
], KubernetesNodeModel.prototype, "qsfs_disks", void 0);
__decorate([
    Expose(),
    IsBoolean(),
    __metadata("design:type", Boolean)
], KubernetesNodeModel.prototype, "public_ip", void 0);
__decorate([
    Expose(),
    IsOptional(),
    IsBoolean(),
    __metadata("design:type", Boolean)
], KubernetesNodeModel.prototype, "public_ip6", void 0);
__decorate([
    Expose(),
    IsBoolean(),
    __metadata("design:type", Boolean)
], KubernetesNodeModel.prototype, "planetary", void 0);
__decorate([
    Expose(),
    IsOptional(),
    IsIP(),
    __metadata("design:type", String)
], KubernetesNodeModel.prototype, "ip", void 0);
__decorate([
    Expose(),
    IsOptional(),
    IsBoolean(),
    __metadata("design:type", Boolean)
], KubernetesNodeModel.prototype, "corex", void 0);
class K8SModel {
}
__decorate([
    Expose(),
    IsString(),
    IsNotEmpty(),
    IsAlphanumeric(),
    MaxLength(NameLength),
    __metadata("design:type", String)
], K8SModel.prototype, "name", void 0);
__decorate([
    Expose(),
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], K8SModel.prototype, "secret", void 0);
__decorate([
    Expose(),
    Type(() => NetworkModel),
    ValidateNested(),
    __metadata("design:type", NetworkModel)
], K8SModel.prototype, "network", void 0);
__decorate([
    Expose(),
    Type(() => KubernetesNodeModel),
    ValidateNested({ each: true }),
    __metadata("design:type", Array)
], K8SModel.prototype, "masters", void 0);
__decorate([
    Expose(),
    Type(() => KubernetesNodeModel),
    ValidateNested({ each: true }),
    __metadata("design:type", Array)
], K8SModel.prototype, "workers", void 0);
__decorate([
    Expose(),
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], K8SModel.prototype, "metadata", void 0);
__decorate([
    Expose(),
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], K8SModel.prototype, "description", void 0);
__decorate([
    Expose(),
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], K8SModel.prototype, "ssh_key", void 0);
class K8SGetModel extends BaseGetDeleteModel {
}
class K8SDeleteModel extends BaseGetDeleteModel {
}
class AddWorkerModel extends KubernetesNodeModel {
}
__decorate([
    Expose(),
    IsString(),
    IsNotEmpty(),
    IsAlphanumeric(),
    MaxLength(NameLength),
    __metadata("design:type", String)
], AddWorkerModel.prototype, "deployment_name", void 0);
class DeleteWorkerModel {
}
__decorate([
    Expose(),
    IsString(),
    IsNotEmpty(),
    IsAlphanumeric(),
    MaxLength(NameLength),
    __metadata("design:type", String)
], DeleteWorkerModel.prototype, "deployment_name", void 0);
__decorate([
    Expose(),
    IsString(),
    IsNotEmpty(),
    IsAlphanumeric(),
    MaxLength(NameLength),
    __metadata("design:type", String)
], DeleteWorkerModel.prototype, "name", void 0);
class ZDBModel {
}
__decorate([
    Expose(),
    IsString(),
    IsNotEmpty(),
    IsAlphanumeric(),
    MaxLength(NameLength),
    __metadata("design:type", String)
], ZDBModel.prototype, "name", void 0);
__decorate([
    Expose(),
    IsInt(),
    Min(1),
    __metadata("design:type", Number)
], ZDBModel.prototype, "node_id", void 0);
__decorate([
    Expose(),
    Transform(({ value }) => ZdbModes[value]),
    IsEnum(ZdbModes),
    __metadata("design:type", String)
], ZDBModel.prototype, "mode", void 0);
__decorate([
    Expose(),
    Min(0.25),
    __metadata("design:type", Number)
], ZDBModel.prototype, "disk_size", void 0);
__decorate([
    Expose(),
    IsBoolean(),
    __metadata("design:type", Boolean)
], ZDBModel.prototype, "publicNamespace", void 0);
__decorate([
    Expose(),
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], ZDBModel.prototype, "password", void 0);
class ZDBSModel {
}
__decorate([
    Expose(),
    IsString(),
    IsNotEmpty(),
    IsAlphanumeric(),
    MaxLength(NameLength),
    __metadata("design:type", String)
], ZDBSModel.prototype, "name", void 0);
__decorate([
    Expose(),
    Type(() => ZDBModel),
    ValidateNested({ each: true }),
    __metadata("design:type", Array)
], ZDBSModel.prototype, "zdbs", void 0);
__decorate([
    Expose(),
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], ZDBSModel.prototype, "metadata", void 0);
__decorate([
    Expose(),
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], ZDBSModel.prototype, "description", void 0);
class ZDBGetModel extends BaseGetDeleteModel {
}
class ZDBDeleteModel extends BaseGetDeleteModel {
}
class AddZDBModel extends ZDBModel {
}
__decorate([
    Expose(),
    IsString(),
    IsNotEmpty(),
    IsAlphanumeric(),
    MaxLength(NameLength),
    __metadata("design:type", String)
], AddZDBModel.prototype, "deployment_name", void 0);
class DeleteZDBModel extends DeleteWorkerModel {
}
class QSFSZDBSModel {
}
__decorate([
    Expose(),
    IsString(),
    IsNotEmpty(),
    IsAlphanumeric(),
    MaxLength(NameLength),
    __metadata("design:type", String)
], QSFSZDBSModel.prototype, "name", void 0);
__decorate([
    Expose(),
    Min(3),
    __metadata("design:type", Number)
], QSFSZDBSModel.prototype, "count", void 0);
__decorate([
    Expose(),
    ArrayNotEmpty(),
    IsInt({ each: true }),
    Min(1, { each: true }),
    __metadata("design:type", Array)
], QSFSZDBSModel.prototype, "node_ids", void 0);
__decorate([
    Expose(),
    Min(0.25),
    __metadata("design:type", Number)
], QSFSZDBSModel.prototype, "disk_size", void 0);
__decorate([
    Expose(),
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], QSFSZDBSModel.prototype, "password", void 0);
__decorate([
    Expose(),
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], QSFSZDBSModel.prototype, "metadata", void 0);
__decorate([
    Expose(),
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], QSFSZDBSModel.prototype, "description", void 0);
class QSFSZDBGetModel extends BaseGetDeleteModel {
}
class QSFSZDBDeleteModel extends BaseGetDeleteModel {
}
class GatewayFQDNModel {
}
__decorate([
    Expose(),
    IsString(),
    IsNotEmpty(),
    IsAlphanumeric(),
    MaxLength(NameLength),
    __metadata("design:type", String)
], GatewayFQDNModel.prototype, "name", void 0);
__decorate([
    Expose(),
    IsInt(),
    Min(1),
    __metadata("design:type", Number)
], GatewayFQDNModel.prototype, "node_id", void 0);
__decorate([
    Expose(),
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], GatewayFQDNModel.prototype, "fqdn", void 0);
__decorate([
    Expose(),
    IsBoolean(),
    __metadata("design:type", Boolean)
], GatewayFQDNModel.prototype, "tls_passthrough", void 0);
__decorate([
    Expose(),
    ArrayNotEmpty(),
    IsUrl({ protocols: ["http", "https"] }, { each: true }),
    __metadata("design:type", Array)
], GatewayFQDNModel.prototype, "backends", void 0);
class GatewayFQDNGetModel extends BaseGetDeleteModel {
}
class GatewayFQDNDeleteModel extends BaseGetDeleteModel {
}
class BaseGatewayNameModel {
}
__decorate([
    Expose(),
    IsString(),
    IsNotEmpty(),
    IsAlphanumeric(),
    __metadata("design:type", String)
], BaseGatewayNameModel.prototype, "name", void 0);
class GatewayNameModel extends BaseGatewayNameModel {
}
__decorate([
    Expose(),
    IsInt(),
    Min(1),
    __metadata("design:type", Number)
], GatewayNameModel.prototype, "node_id", void 0);
__decorate([
    Expose(),
    IsBoolean(),
    __metadata("design:type", Boolean)
], GatewayNameModel.prototype, "tls_passthrough", void 0);
__decorate([
    Expose(),
    ArrayNotEmpty(),
    IsUrl({ protocols: ["http", "https"] }, { each: true }),
    __metadata("design:type", Array)
], GatewayNameModel.prototype, "backends", void 0);
class GatewayNameGetModel extends BaseGatewayNameModel {
}
class GatewayNameDeleteModel extends BaseGatewayNameModel {
}
class ZOSModel extends Deployment {
}
__decorate([
    Expose(),
    IsInt(),
    Min(1),
    __metadata("design:type", Number)
], ZOSModel.prototype, "node_id", void 0);
class NodeContractCreateModel {
}
__decorate([
    Expose(),
    IsInt(),
    Min(1),
    __metadata("design:type", Number)
], NodeContractCreateModel.prototype, "node_id", void 0);
__decorate([
    Expose(),
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], NodeContractCreateModel.prototype, "hash", void 0);
__decorate([
    Expose(),
    IsString(),
    IsDefined(),
    __metadata("design:type", String)
], NodeContractCreateModel.prototype, "data", void 0);
__decorate([
    Expose(),
    IsInt(),
    Min(0),
    __metadata("design:type", Number)
], NodeContractCreateModel.prototype, "public_ip", void 0);
class NameContractCreateModel {
}
__decorate([
    Expose(),
    IsString(),
    IsNotEmpty(),
    IsAlphanumeric(),
    MaxLength(NameLength),
    __metadata("design:type", String)
], NameContractCreateModel.prototype, "name", void 0);
class RentContractCreateModel {
}
__decorate([
    Expose(),
    IsInt(),
    IsNotEmpty(),
    __metadata("design:type", Number)
], RentContractCreateModel.prototype, "nodeId", void 0);
class RentContractGetModel {
}
__decorate([
    Expose(),
    IsInt(),
    IsNotEmpty(),
    __metadata("design:type", Number)
], RentContractGetModel.prototype, "nodeId", void 0);
class RentContractDeleteModel {
}
__decorate([
    Expose(),
    IsInt(),
    IsNotEmpty(),
    __metadata("design:type", Number)
], RentContractDeleteModel.prototype, "nodeId", void 0);
class ContractGetModel {
}
__decorate([
    Expose(),
    IsInt(),
    Min(1),
    __metadata("design:type", Number)
], ContractGetModel.prototype, "id", void 0);
class ContractGetByNodeIdAndHashModel {
}
__decorate([
    Expose(),
    IsInt(),
    Min(1),
    __metadata("design:type", Number)
], ContractGetByNodeIdAndHashModel.prototype, "node_id", void 0);
__decorate([
    Expose(),
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], ContractGetByNodeIdAndHashModel.prototype, "hash", void 0);
class NameContractGetModel {
}
__decorate([
    Expose(),
    IsString(),
    IsNotEmpty(),
    IsAlphanumeric(),
    MaxLength(NameLength),
    __metadata("design:type", String)
], NameContractGetModel.prototype, "name", void 0);
class NodeContractUpdateModel {
}
__decorate([
    Expose(),
    IsInt(),
    Min(1),
    __metadata("design:type", Number)
], NodeContractUpdateModel.prototype, "id", void 0);
__decorate([
    Expose(),
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], NodeContractUpdateModel.prototype, "hash", void 0);
__decorate([
    Expose(),
    IsString(),
    IsDefined(),
    __metadata("design:type", String)
], NodeContractUpdateModel.prototype, "data", void 0);
class ContractCancelModel {
}
__decorate([
    Expose(),
    IsInt(),
    Min(1),
    __metadata("design:type", Number)
], ContractCancelModel.prototype, "id", void 0);
class ContractsByTwinId {
}
__decorate([
    Expose(),
    IsInt(),
    Min(1),
    __metadata("design:type", Number)
], ContractsByTwinId.prototype, "twinId", void 0);
class ContractsByAddress {
}
__decorate([
    Expose(),
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], ContractsByAddress.prototype, "address", void 0);
class ContractConsumption {
}
__decorate([
    Expose(),
    IsInt(),
    Min(1),
    __metadata("design:type", Number)
], ContractConsumption.prototype, "id", void 0);
class TwinCreateModel {
}
__decorate([
    Expose(),
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], TwinCreateModel.prototype, "ip", void 0);
class TwinGetModel {
}
__decorate([
    Expose(),
    IsInt(),
    Min(1),
    __metadata("design:type", Number)
], TwinGetModel.prototype, "id", void 0);
class TwinGetByAccountIdModel {
}
__decorate([
    Expose(),
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], TwinGetByAccountIdModel.prototype, "public_key", void 0);
class TwinDeleteModel {
}
__decorate([
    Expose(),
    IsInt(),
    Min(1),
    __metadata("design:type", Number)
], TwinDeleteModel.prototype, "id", void 0);
class KVStoreSetModel {
}
__decorate([
    Expose(),
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], KVStoreSetModel.prototype, "key", void 0);
__decorate([
    Expose(),
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], KVStoreSetModel.prototype, "value", void 0);
class KVStoreGetModel {
}
__decorate([
    Expose(),
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], KVStoreGetModel.prototype, "key", void 0);
class KVStoreRemoveModel {
}
__decorate([
    Expose(),
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], KVStoreRemoveModel.prototype, "key", void 0);
class BalanceGetModel {
}
__decorate([
    Expose(),
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], BalanceGetModel.prototype, "address", void 0);
class BalanceTransferModel {
}
__decorate([
    Expose(),
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], BalanceTransferModel.prototype, "address", void 0);
__decorate([
    Expose(),
    Min(0.0000001),
    __metadata("design:type", Number)
], BalanceTransferModel.prototype, "amount", void 0);
class WalletImportModel {
}
__decorate([
    Expose(),
    IsString(),
    IsNotEmpty(),
    IsAlphanumeric(),
    MaxLength(NameLength),
    __metadata("design:type", String)
], WalletImportModel.prototype, "name", void 0);
__decorate([
    Expose(),
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], WalletImportModel.prototype, "secret", void 0);
class WalletBalanceByNameModel {
}
__decorate([
    Expose(),
    IsString(),
    IsNotEmpty(),
    IsAlphanumeric(),
    MaxLength(NameLength),
    __metadata("design:type", String)
], WalletBalanceByNameModel.prototype, "name", void 0);
class WalletBalanceByAddressModel {
}
__decorate([
    Expose(),
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], WalletBalanceByAddressModel.prototype, "address", void 0);
class WalletTransferModel {
}
__decorate([
    Expose(),
    IsString(),
    IsNotEmpty(),
    IsAlphanumeric(),
    MaxLength(NameLength),
    __metadata("design:type", String)
], WalletTransferModel.prototype, "name", void 0);
__decorate([
    Expose(),
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], WalletTransferModel.prototype, "target_address", void 0);
__decorate([
    Expose(),
    Min(0.0000001),
    __metadata("design:type", Number)
], WalletTransferModel.prototype, "amount", void 0);
__decorate([
    Expose(),
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], WalletTransferModel.prototype, "asset", void 0);
__decorate([
    Expose(),
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], WalletTransferModel.prototype, "memo", void 0);
class WalletDeleteModel {
}
__decorate([
    Expose(),
    IsString(),
    IsNotEmpty(),
    IsAlphanumeric(),
    MaxLength(NameLength),
    __metadata("design:type", String)
], WalletDeleteModel.prototype, "name", void 0);
class WalletGetModel extends WalletDeleteModel {
}
class FarmsGetModel {
}
__decorate([
    Expose(),
    IsInt(),
    Min(1),
    IsOptional(),
    __metadata("design:type", Number)
], FarmsGetModel.prototype, "page", void 0);
__decorate([
    Expose(),
    IsInt(),
    Min(1),
    IsOptional(),
    __metadata("design:type", Number)
], FarmsGetModel.prototype, "maxResult", void 0);
class NodesGetModel extends FarmsGetModel {
}
class FarmHasFreePublicIPsModel {
}
__decorate([
    Expose(),
    IsInt(),
    Min(1),
    __metadata("design:type", Number)
], FarmHasFreePublicIPsModel.prototype, "farmId", void 0);
class NodesByFarmIdModel extends FarmHasFreePublicIPsModel {
}
class NodeFreeResourcesModel {
}
__decorate([
    Expose(),
    IsInt(),
    Min(1),
    __metadata("design:type", Number)
], NodeFreeResourcesModel.prototype, "nodeId", void 0);
class FarmIdFromFarmNameModel {
}
__decorate([
    Expose(),
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], FarmIdFromFarmNameModel.prototype, "farmName", void 0);
class FilterOptions {
}
__decorate([
    Expose(),
    IsOptional(),
    Min(0),
    __metadata("design:type", Number)
], FilterOptions.prototype, "cru", void 0);
__decorate([
    Expose(),
    IsOptional(),
    Min(0),
    __metadata("design:type", Number)
], FilterOptions.prototype, "mru", void 0);
__decorate([
    Expose(),
    IsOptional(),
    Min(0),
    __metadata("design:type", Number)
], FilterOptions.prototype, "sru", void 0);
__decorate([
    Expose(),
    IsOptional(),
    Min(0),
    __metadata("design:type", Number)
], FilterOptions.prototype, "hru", void 0);
__decorate([
    Expose(),
    IsOptional(),
    IsBoolean(),
    __metadata("design:type", Boolean)
], FilterOptions.prototype, "publicIPs", void 0);
__decorate([
    Expose(),
    IsOptional(),
    IsBoolean(),
    __metadata("design:type", Boolean)
], FilterOptions.prototype, "accessNodeV4", void 0);
__decorate([
    Expose(),
    IsOptional(),
    IsBoolean(),
    __metadata("design:type", Boolean)
], FilterOptions.prototype, "accessNodeV6", void 0);
__decorate([
    Expose(),
    IsOptional(),
    IsBoolean(),
    __metadata("design:type", Boolean)
], FilterOptions.prototype, "gateway", void 0);
__decorate([
    Expose(),
    IsOptional(),
    IsInt(),
    Min(1),
    __metadata("design:type", Number)
], FilterOptions.prototype, "farmId", void 0);
__decorate([
    Expose(),
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], FilterOptions.prototype, "farmName", void 0);
__decorate([
    Expose(),
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], FilterOptions.prototype, "country", void 0);
__decorate([
    Expose(),
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], FilterOptions.prototype, "city", void 0);
__decorate([
    Expose(),
    IsOptional(),
    IsBoolean(),
    __metadata("design:type", Boolean)
], FilterOptions.prototype, "dedicated", void 0);
__decorate([
    Expose(),
    IsOptional(),
    IsInt(),
    __metadata("design:type", Number)
], FilterOptions.prototype, "availableFor", void 0);
export { DiskModel, NetworkModel, MachineModel, MachinesModel, MachinesGetModel, MachinesDeleteModel, AddMachineModel, DeleteMachineModel, KubernetesNodeModel, K8SModel, K8SGetModel, K8SDeleteModel, AddWorkerModel, DeleteWorkerModel, ZDBModel, ZDBSModel, ZDBGetModel, ZDBDeleteModel, AddZDBModel, DeleteZDBModel, GatewayFQDNModel, GatewayNameModel, ZOSModel, QSFSDiskModel, QSFSZDBSModel, QSFSZDBGetModel, QSFSZDBDeleteModel, NodeContractCreateModel, NameContractCreateModel, RentContractCreateModel, RentContractGetModel, RentContractDeleteModel, ContractGetModel, ContractGetByNodeIdAndHashModel, NameContractGetModel, NodeContractUpdateModel, ContractCancelModel, ContractsByTwinId, ContractsByAddress, ContractConsumption, TwinCreateModel, TwinGetModel, TwinGetByAccountIdModel, TwinDeleteModel, KVStoreSetModel, KVStoreGetModel, KVStoreRemoveModel, BalanceGetModel, BalanceTransferModel, WalletImportModel, WalletBalanceByNameModel, WalletBalanceByAddressModel, WalletTransferModel, WalletDeleteModel, WalletGetModel, GatewayFQDNGetModel, GatewayFQDNDeleteModel, GatewayNameGetModel, GatewayNameDeleteModel, FarmsGetModel, NodesGetModel, FarmHasFreePublicIPsModel, NodesByFarmIdModel, NodeFreeResourcesModel, FarmIdFromFarmNameModel, FilterOptions, };
