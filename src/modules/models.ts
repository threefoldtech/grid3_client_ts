import { ContractState } from "../clients/tf-grid/contracts";
import { Deployment } from "../zos/deployment";
import { ZdbModes } from "../zos/zdb";
import {
    ArrayNotEmpty,
    IsAlphanumeric,
    IsBoolean,
    IsDefined,
    IsEnum,
    IsInt,
    IsNotEmpty,
    IsOptional,
    IsString,
    IsUrl,
    MaxLength,
    Min,
    ValidateNested,
} from "class-validator";
import { Expose, Transform, Type } from "class-transformer";

const NameLength = 15;

//TODO: find a way to validate all fields are passed while casting data to any of these classes.
class DiskModel {
    @Expose() @IsString() @IsNotEmpty() @IsAlphanumeric() @MaxLength(NameLength) name: string;
    @Expose() @Min(0.25) size: number; // in GB
    @Expose() @IsString() @IsNotEmpty() mountpoint: string;
}

class QSFSDiskModel {
    @Expose() @IsString() @IsNotEmpty() @IsAlphanumeric() @MaxLength(NameLength) qsfs_zdbs_name: string;
    @Expose() @IsString() @IsNotEmpty() @IsAlphanumeric() @MaxLength(NameLength) name: string;
    @Expose() @IsString() @IsNotEmpty() prefix: string;
    @Expose() @IsString() @IsNotEmpty() encryption_key: string;
    @Expose() @Min(0.25) @IsOptional() cache?: number; // in GB
    @Expose() @IsInt() @Min(1) @IsOptional() minimal_shards?: number;
    @Expose() @IsInt() @Min(2) @IsOptional() expected_shards?: number;
    @Expose() @IsString() @IsNotEmpty() mountpoint: string;
}

class NetworkModel {
    @Expose() @IsString() @IsNotEmpty() @IsAlphanumeric() @MaxLength(NameLength) name: string;
    @Expose() @IsString() @IsNotEmpty() ip_range: string;
}

class BaseGetDeleteModel {
    @Expose() @IsString() @IsNotEmpty() @IsAlphanumeric() @MaxLength(NameLength) name: string;
}

class MachineModel {
    @Expose() @IsString() @IsNotEmpty() @IsAlphanumeric() @MaxLength(NameLength) name: string;
    @Expose() @IsInt() @Min(1) node_id: number;
    @Expose() @IsOptional() @Type(() => DiskModel) @ValidateNested({ each: true }) disks?: DiskModel[];
    @Expose() @IsOptional() @Type(() => QSFSDiskModel) @ValidateNested({ each: true }) qsfs_disks?: QSFSDiskModel[];
    @Expose() @IsBoolean() public_ip: boolean;
    @Expose() @IsBoolean() planetary: boolean;
    @Expose() @IsInt() @Min(1) cpu: number;
    @Expose() @Min(250) memory: number; // in MB
    @Expose() @Min(0.25) rootfs_size: number; // in GB
    @Expose() @IsUrl() @IsNotEmpty() flist: string;
    @Expose() @IsString() @IsDefined() entrypoint: string;
    @Expose() env: Record<string, unknown>;
}

class MachinesModel {
    @Expose() @IsString() @IsNotEmpty() @IsAlphanumeric() @MaxLength(NameLength) name: string;
    @Expose() @Type(() => NetworkModel) @ValidateNested() network: NetworkModel;
    @Expose() @Type(() => MachineModel) @ValidateNested({ each: true }) machines: MachineModel[];
    @Expose() @IsString() @IsOptional() metadata?: string;
    @Expose() @IsString() @IsOptional() description?: string;
}

class AddMachineModel extends MachineModel {
    @Expose() @IsString() @IsNotEmpty() @IsAlphanumeric() @MaxLength(NameLength) deployment_name: string;
}

class DeleteMachineModel {
    @Expose() @IsString() @IsNotEmpty() @IsAlphanumeric() @MaxLength(NameLength) name: string;
    @Expose() @IsString() @IsNotEmpty() @IsAlphanumeric() @MaxLength(NameLength) deployment_name: string;
}

class MachinesGetModel extends BaseGetDeleteModel {}

class MachinesDeleteModel extends BaseGetDeleteModel {}

class KubernetesNodeModel {
    @Expose() @IsString() @IsNotEmpty() @IsAlphanumeric() @MaxLength(NameLength) name: string;
    @Expose() @IsInt() @Min(1) node_id: number;
    @Expose() @IsInt() @Min(1) cpu: number;
    @Expose() @Min(250) memory: number; // in MB
    @Expose() @Min(0.25) rootfs_size: number; // in GB
    @Expose() @Min(0.25) disk_size: number; // in GB
    @Expose() @IsOptional() @Type(() => QSFSDiskModel) @ValidateNested({ each: true }) qsfs_disks?: QSFSDiskModel[];
    @Expose() @IsBoolean() public_ip: boolean;
    @Expose() @IsBoolean() planetary: boolean;
}

class K8SModel {
    @Expose() @IsString() @IsNotEmpty() @IsAlphanumeric() @MaxLength(NameLength) name: string;
    @Expose() @IsString() @IsNotEmpty() secret: string;
    @Expose() @Type(() => NetworkModel) @ValidateNested() network: NetworkModel;
    @Expose() @Type(() => KubernetesNodeModel) @ValidateNested({ each: true }) masters: KubernetesNodeModel[];
    @Expose() @Type(() => KubernetesNodeModel) @ValidateNested({ each: true }) workers?: KubernetesNodeModel[];
    @Expose() @IsString() @IsOptional() metadata?: string;
    @Expose() @IsString() @IsOptional() description?: string;
    @Expose() @IsString() @IsNotEmpty() ssh_key: string; // is not optional as if the user forget it, he will not be able to use the cluster.
}

class K8SGetModel extends BaseGetDeleteModel {}

class K8SDeleteModel extends BaseGetDeleteModel {}

class AddWorkerModel extends KubernetesNodeModel {
    @Expose() @IsString() @IsNotEmpty() @IsAlphanumeric() @MaxLength(NameLength) deployment_name: string;
}

class DeleteWorkerModel {
    @Expose() @IsString() @IsNotEmpty() @IsAlphanumeric() @MaxLength(NameLength) deployment_name: string;
    @Expose() @IsString() @IsNotEmpty() @IsAlphanumeric() @MaxLength(NameLength) name: string;
}

class ZDBModel {
    @Expose() @IsString() @IsNotEmpty() @IsAlphanumeric() @MaxLength(NameLength) name: string;
    @Expose() @IsInt() @Min(1) node_id: number;
    @Expose() @Transform(({ value }) => ZdbModes[value]) @IsEnum(ZdbModes) mode: ZdbModes;
    @Expose() @Min(0.25) disk_size: number; // in GB
    @Expose() @IsBoolean() publicNamespace: boolean;
    @Expose() @IsString() @IsNotEmpty() password: string;
}

class ZDBSModel {
    @Expose() @IsString() @IsNotEmpty() @IsAlphanumeric() @MaxLength(NameLength) name: string;
    @Expose() @Type(() => ZDBModel) @ValidateNested({ each: true }) zdbs: ZDBModel[];
    @Expose() @IsString() @IsOptional() metadata?: string;
    @Expose() @IsString() @IsOptional() description?: string;
}

class ZDBGetModel extends BaseGetDeleteModel {}

class ZDBDeleteModel extends BaseGetDeleteModel {}

class AddZDBModel extends ZDBModel {
    @Expose() @IsString() @IsNotEmpty() @IsAlphanumeric() @MaxLength(NameLength) deployment_name: string;
}

class DeleteZDBModel extends DeleteWorkerModel {}

class QSFSZDBSModel {
    @Expose() @IsString() @IsNotEmpty() @IsAlphanumeric() @MaxLength(NameLength) name: string;
    @Expose() @Min(3) count: number;
    @Expose() @ArrayNotEmpty() @IsInt({ each: true }) @Min(1, { each: true }) node_ids: number[];
    @Expose() @Min(0.25) disk_size: number;
    @Expose() @IsString() @IsNotEmpty() password: string;
    @Expose() @IsString() @IsOptional() metadata?: string;
    @Expose() @IsString() @IsOptional() description?: string;
}

class QSFSZDBGetModel extends BaseGetDeleteModel {}

class QSFSZDBDeleteModel extends BaseGetDeleteModel {}

class GatewayFQDNModel {
    @Expose() @IsString() @IsNotEmpty() @IsAlphanumeric() @MaxLength(NameLength) name: string;
    @Expose() @IsInt() @Min(1) node_id: number;
    @Expose() @IsString() @IsNotEmpty() fqdn: string;
    @Expose() @IsBoolean() tls_passthrough: boolean;
    @Expose() @ArrayNotEmpty() @IsUrl({ protocols: ["http", "https"] }, { each: true }) backends: string[];
}

class GatewayFQDNGetModel extends BaseGetDeleteModel {}

class GatewayFQDNDeleteModel extends BaseGetDeleteModel {}

class GatewayNameModel {
    @Expose() @IsString() @IsNotEmpty() @IsAlphanumeric() @MaxLength(NameLength) name: string;
    @Expose() @IsInt() @Min(1) node_id: number;
    @Expose() @IsBoolean() tls_passthrough: boolean;
    @Expose() @ArrayNotEmpty() @IsUrl({ protocols: ["http", "https"] }, { each: true }) backends: string[];
}

class GatewayNameGetModel extends BaseGetDeleteModel {}

class GatewayNameDeleteModel extends BaseGetDeleteModel {}

class ZOSModel extends Deployment {
    @Expose() @IsInt() @Min(1) node_id: number;
}

class NodeContractCreateModel {
    @Expose() @IsInt() @Min(1) node_id: number;
    @Expose() @IsString() @IsNotEmpty() hash: string;
    @Expose() @IsString() @IsDefined() data: string;
    @Expose() @IsInt() @Min(0) public_ip: number;
}

class NameContractCreateModel {
    @Expose() @IsString() @IsNotEmpty() @IsAlphanumeric() @MaxLength(NameLength) name: string;
}
class ContractGetModel {
    @Expose() @IsInt() @Min(1) id: number;
}

class ContractGetByNodeIdAndHashModel {
    @Expose() @IsInt() @Min(1) node_id: number;
    @Expose() @IsString() @IsNotEmpty() hash: string;
}

class NodeContractsGetModel {
    @Expose() @IsInt() @Min(1) node_id: number;
    @Expose() @Transform(({ value }) => ContractState[value]) @IsEnum(ContractState) state: ContractState;
}

class NameContractGetModel {
    @Expose() @IsString() @IsNotEmpty() @IsAlphanumeric() @MaxLength(NameLength) name: string;
}

class NodeContractUpdateModel {
    @Expose() @IsInt() @Min(1) id: number;
    @Expose() @IsString() @IsNotEmpty() hash: string;
    @Expose() @IsString() @IsDefined() data: string;
}

class ContractCancelModel {
    @Expose() @IsInt() @Min(1) id: number;
}

class ContractsByTwinId {
    @Expose() @IsInt() @Min(1) twinId: number;
}

class ContractsByAddress {
    @Expose() @IsString() @IsNotEmpty() address: string;
}

class TwinCreateModel {
    @Expose() @IsString() @IsNotEmpty() ip: string;
}

class TwinGetModel {
    @Expose() @IsInt() @Min(1) id: number;
}

class TwinGetByAccountIdModel {
    @Expose() @IsString() @IsNotEmpty() public_key: string;
}

class TwinDeleteModel {
    @Expose() @IsInt() @Min(1) id: number;
}

class KVStoreSetModel {
    @Expose() @IsString() @IsNotEmpty() key: string;
    @Expose() @IsString() @IsNotEmpty() value: string;
}
class KVStoreGetModel {
    @Expose() @IsString() @IsNotEmpty() key: string;
}
class KVStoreRemoveModel {
    @Expose() @IsString() @IsNotEmpty() key: string;
}

class WalletImportModel {
    @Expose() @IsString() @IsNotEmpty() @IsAlphanumeric() @MaxLength(NameLength) name: string;
    @Expose() @IsString() @IsNotEmpty() secret: string;
}

class WalletBalanceByNameModel {
    @Expose() @IsString() @IsNotEmpty() @IsAlphanumeric() @MaxLength(NameLength) name: string;
}

class WalletBalanceByAddressModel {
    @Expose() @IsString() @IsNotEmpty() address: string;
}

class WalletTransferModel {
    @Expose() @IsString() @IsNotEmpty() @IsAlphanumeric() @MaxLength(NameLength) name: string;
    @Expose() @IsString() @IsNotEmpty() target_address: string;
    @Expose() @Min(0.0000001) amount: number;
    @Expose() @IsString() @IsNotEmpty() asset: string;
    @Expose() @IsString() @IsOptional() memo?: string;
}

class WalletDeleteModel {
    @Expose() @IsString() @IsNotEmpty() @IsAlphanumeric() @MaxLength(NameLength) name: string;
}

class WalletGetModel extends WalletDeleteModel {}

export {
    DiskModel,
    NetworkModel,
    MachineModel,
    MachinesModel,
    MachinesGetModel,
    MachinesDeleteModel,
    AddMachineModel,
    DeleteMachineModel,
    KubernetesNodeModel,
    K8SModel,
    K8SGetModel,
    K8SDeleteModel,
    AddWorkerModel,
    DeleteWorkerModel,
    ZDBModel,
    ZDBSModel,
    ZDBGetModel,
    ZDBDeleteModel,
    AddZDBModel,
    DeleteZDBModel,
    GatewayFQDNModel,
    GatewayNameModel,
    ZOSModel,
    QSFSDiskModel,
    QSFSZDBSModel,
    QSFSZDBGetModel,
    QSFSZDBDeleteModel,
    NodeContractCreateModel,
    NameContractCreateModel,
    ContractGetModel,
    ContractGetByNodeIdAndHashModel,
    NodeContractsGetModel,
    NameContractGetModel,
    NodeContractUpdateModel,
    ContractCancelModel,
    ContractsByTwinId,
    ContractsByAddress,
    TwinCreateModel,
    TwinGetModel,
    TwinGetByAccountIdModel,
    TwinDeleteModel,
    KVStoreSetModel,
    KVStoreGetModel,
    KVStoreRemoveModel,
    WalletImportModel,
    WalletBalanceByNameModel,
    WalletBalanceByAddressModel,
    WalletTransferModel,
    WalletDeleteModel,
    WalletGetModel,
    GatewayFQDNGetModel,
    GatewayFQDNDeleteModel,
    GatewayNameGetModel,
    GatewayNameDeleteModel,
};
