import { Deployment } from "../zos/deployment";
import { ZdbModes } from "../zos/zdb";
declare class DiskModel {
    name: string;
    size: number;
    mountpoint: string;
}
declare class QSFSDiskModel {
    qsfs_zdbs_name: string;
    name: string;
    prefix: string;
    encryption_key: string;
    cache?: number;
    minimal_shards?: number;
    expected_shards?: number;
    mountpoint: string;
}
declare class NetworkModel {
    name: string;
    ip_range: string;
    addAccess?: boolean;
}
declare class BaseGetDeleteModel {
    name: string;
}
declare class MachineModel {
    name: string;
    node_id: number;
    disks?: DiskModel[];
    qsfs_disks?: QSFSDiskModel[];
    public_ip: boolean;
    public_ip6?: boolean;
    planetary: boolean;
    cpu: number;
    memory: number;
    rootfs_size: number;
    flist: string;
    entrypoint: string;
    env: Record<string, unknown>;
    ip?: string;
    corex?: boolean;
}
declare class MachinesModel {
    name: string;
    network: NetworkModel;
    machines: MachineModel[];
    metadata?: string;
    description?: string;
}
declare class AddMachineModel extends MachineModel {
    deployment_name: string;
}
declare class DeleteMachineModel {
    name: string;
    deployment_name: string;
}
declare class MachinesGetModel extends BaseGetDeleteModel {
}
declare class MachinesDeleteModel extends BaseGetDeleteModel {
}
declare class KubernetesNodeModel {
    name: string;
    node_id: number;
    cpu: number;
    memory: number;
    rootfs_size: number;
    disk_size: number;
    qsfs_disks?: QSFSDiskModel[];
    public_ip: boolean;
    public_ip6: boolean;
    planetary: boolean;
    ip?: string;
    corex?: boolean;
}
declare class K8SModel {
    name: string;
    secret: string;
    network: NetworkModel;
    masters: KubernetesNodeModel[];
    workers?: KubernetesNodeModel[];
    metadata?: string;
    description?: string;
    ssh_key: string;
}
declare class K8SGetModel extends BaseGetDeleteModel {
}
declare class K8SDeleteModel extends BaseGetDeleteModel {
}
declare class AddWorkerModel extends KubernetesNodeModel {
    deployment_name: string;
}
declare class DeleteWorkerModel {
    deployment_name: string;
    name: string;
}
declare class ZDBModel {
    name: string;
    node_id: number;
    mode: ZdbModes;
    disk_size: number;
    publicNamespace: boolean;
    password: string;
}
declare class ZDBSModel {
    name: string;
    zdbs: ZDBModel[];
    metadata?: string;
    description?: string;
}
declare class ZDBGetModel extends BaseGetDeleteModel {
}
declare class ZDBDeleteModel extends BaseGetDeleteModel {
}
declare class AddZDBModel extends ZDBModel {
    deployment_name: string;
}
declare class DeleteZDBModel extends DeleteWorkerModel {
}
declare class QSFSZDBSModel {
    name: string;
    count: number;
    node_ids: number[];
    disk_size: number;
    password: string;
    metadata?: string;
    description?: string;
}
declare class QSFSZDBGetModel extends BaseGetDeleteModel {
}
declare class QSFSZDBDeleteModel extends BaseGetDeleteModel {
}
declare class GatewayFQDNModel {
    name: string;
    node_id: number;
    fqdn: string;
    tls_passthrough: boolean;
    backends: string[];
}
declare class GatewayFQDNGetModel extends BaseGetDeleteModel {
}
declare class GatewayFQDNDeleteModel extends BaseGetDeleteModel {
}
declare class BaseGatewayNameModel {
    name: string;
}
declare class GatewayNameModel extends BaseGatewayNameModel {
    node_id: number;
    tls_passthrough: boolean;
    backends: string[];
}
declare class GatewayNameGetModel extends BaseGatewayNameModel {
}
declare class GatewayNameDeleteModel extends BaseGatewayNameModel {
}
declare class ZOSModel extends Deployment {
    node_id: number;
}
declare class NodeContractCreateModel {
    node_id: number;
    hash: string;
    data: string;
    public_ip: number;
}
declare class NameContractCreateModel {
    name: string;
}
declare class RentContractCreateModel {
    nodeId: number;
}
declare class RentContractGetModel {
    nodeId: number;
}
declare class RentContractDeleteModel {
    nodeId: number;
}
declare class ContractGetModel {
    id: number;
}
declare class ContractGetByNodeIdAndHashModel {
    node_id: number;
    hash: string;
}
declare class NameContractGetModel {
    name: string;
}
declare class NodeContractUpdateModel {
    id: number;
    hash: string;
    data: string;
}
declare class ContractCancelModel {
    id: number;
}
declare class ContractsByTwinId {
    twinId: number;
}
declare class ContractsByAddress {
    address: string;
}
declare class ContractConsumption {
    id: number;
}
declare class TwinCreateModel {
    ip: string;
}
declare class TwinGetModel {
    id: number;
}
declare class TwinGetByAccountIdModel {
    public_key: string;
}
declare class TwinDeleteModel {
    id: number;
}
declare class KVStoreSetModel {
    key: string;
    value: string;
}
declare class KVStoreGetModel {
    key: string;
}
declare class KVStoreRemoveModel {
    key: string;
}
declare class BalanceGetModel {
    address: string;
}
declare class BalanceTransferModel {
    address: string;
    amount: number;
}
declare class WalletImportModel {
    name: string;
    secret: string;
}
declare class WalletBalanceByNameModel {
    name: string;
}
declare class WalletBalanceByAddressModel {
    address: string;
}
declare class WalletTransferModel {
    name: string;
    target_address: string;
    amount: number;
    asset: string;
    memo?: string;
}
declare class WalletDeleteModel {
    name: string;
}
declare class WalletGetModel extends WalletDeleteModel {
}
declare class FarmsGetModel {
    page?: number;
    maxResult?: number;
}
declare class NodesGetModel extends FarmsGetModel {
}
declare class FarmHasFreePublicIPsModel {
    farmId: number;
}
declare class NodesByFarmIdModel extends FarmHasFreePublicIPsModel {
}
declare class NodeFreeResourcesModel {
    nodeId: number;
}
declare class FarmIdFromFarmNameModel {
    farmName: string;
}
declare class FilterOptions {
    cru?: number;
    mru?: number;
    sru?: number;
    hru?: number;
    publicIPs?: boolean;
    accessNodeV4?: boolean;
    accessNodeV6?: boolean;
    gateway?: boolean;
    farmId?: number;
    farmName?: string;
    country?: string;
    city?: string;
    dedicated?: boolean;
    availableFor?: number;
}
export { DiskModel, NetworkModel, MachineModel, MachinesModel, MachinesGetModel, MachinesDeleteModel, AddMachineModel, DeleteMachineModel, KubernetesNodeModel, K8SModel, K8SGetModel, K8SDeleteModel, AddWorkerModel, DeleteWorkerModel, ZDBModel, ZDBSModel, ZDBGetModel, ZDBDeleteModel, AddZDBModel, DeleteZDBModel, GatewayFQDNModel, GatewayNameModel, ZOSModel, QSFSDiskModel, QSFSZDBSModel, QSFSZDBGetModel, QSFSZDBDeleteModel, NodeContractCreateModel, NameContractCreateModel, RentContractCreateModel, RentContractGetModel, RentContractDeleteModel, ContractGetModel, ContractGetByNodeIdAndHashModel, NameContractGetModel, NodeContractUpdateModel, ContractCancelModel, ContractsByTwinId, ContractsByAddress, ContractConsumption, TwinCreateModel, TwinGetModel, TwinGetByAccountIdModel, TwinDeleteModel, KVStoreSetModel, KVStoreGetModel, KVStoreRemoveModel, BalanceGetModel, BalanceTransferModel, WalletImportModel, WalletBalanceByNameModel, WalletBalanceByAddressModel, WalletTransferModel, WalletDeleteModel, WalletGetModel, GatewayFQDNGetModel, GatewayFQDNDeleteModel, GatewayNameGetModel, GatewayNameDeleteModel, FarmsGetModel, NodesGetModel, FarmHasFreePublicIPsModel, NodesByFarmIdModel, NodeFreeResourcesModel, FarmIdFromFarmNameModel, FilterOptions, };
//# sourceMappingURL=models.d.ts.map