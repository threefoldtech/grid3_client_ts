import { ContractState } from "../clients/tf-grid/contracts";
import { Deployment } from "../zos/deployment";
import { ZdbModes } from "../zos/zdb";

//TODO: find a way to validate all fields are passed while casting data to any of these classes.
class DiskModel {
    name: string;
    size: number; // in GB
    mountpoint: string;
}

class QSFSDiskModel {
    qsfs_zdbs_name: string;
    name: string;
    prefix: string;
    encryption_key: string;
    cache: number; // in GB
    minimal_shards: number;
    expected_shards: number;
    mountpoint: string;
}

class NetworkModel {
    name: string;
    ip_range: string;
}

class BaseGetDeleteModel {
    name: string;
}

class MachineModel {
    name: string;
    node_id: number;
    disks: DiskModel[];
    qsfs_disks: QSFSDiskModel[];
    public_ip: boolean;
    planetary: boolean;
    cpu: number;
    memory: number; // in MB
    rootfs_size: number; // in GB
    flist: string;
    entrypoint: string;
    env: Record<string, unknown>;
}

class MachinesModel {
    name: string;
    network: NetworkModel;
    machines: MachineModel[];
    metadata: string;
    description: string;
}

class AddMachineModel extends MachineModel {
    deployment_name: string;
}

class DeleteMachineModel {
    name: string;
    deployment_name: string;
}

class MachinesGetModel extends BaseGetDeleteModel {}

class MachinesDeleteModel extends BaseGetDeleteModel {}

class KubernetesNodeModel {
    name: string;
    node_id: number;
    cpu: number;
    memory: number; // in MB
    rootfs_size: number; // in GB
    disk_size: number; // in GB
    qsfs_disks: QSFSDiskModel[];
    public_ip: boolean;
    planetary: boolean;
}

class K8SModel {
    name: string;
    secret: string;
    network: NetworkModel;
    masters: KubernetesNodeModel[];
    workers: KubernetesNodeModel[];
    metadata: string;
    description: string;
    ssh_key: string;
}

class K8SGetModel extends BaseGetDeleteModel {}

class K8SDeleteModel extends BaseGetDeleteModel {}

class AddWorkerModel extends KubernetesNodeModel {
    deployment_name: string;
}

class DeleteWorkerModel {
    deployment_name: string;
    name: string;
}

class ZDBModel {
    name: string;
    node_id: number;
    mode: ZdbModes;
    disk_size: number;
    public_ipv6: boolean;
    password: string;
}

class ZDBSModel {
    name: string;
    zdbs: ZDBModel[];
    metadata: string;
    description: string;
}

class ZDBGetModel extends BaseGetDeleteModel {}

class ZDBDeleteModel extends BaseGetDeleteModel {}

class AddZDBModel extends ZDBModel {
    deployment_name: string;
}

class DeleteZDBModel extends DeleteWorkerModel {}

class QSFSZDBSModel {
    name: string;
    count: number;
    node_ids: number[];
    disk_size: number;
    password: string;
    metadata: string;
    description: string;
}

class QSFSZDBGetModel extends BaseGetDeleteModel {}

class QSFSZDBDeleteModel extends BaseGetDeleteModel {}

class GatewayFQDNModel {
    name: string;
    node_id: number;
    fqdn: string;
    tls_passthrough: boolean;
    backends: string[];
}

class GatewayFQDNGetModel extends BaseGetDeleteModel {}

class GatewayFQDNDeleteModel extends BaseGetDeleteModel {}

class GatewayNameModel {
    name: string;
    node_id: number;
    tls_passthrough: boolean;
    backends: string[];
}

class GatewayNameGetModel extends BaseGetDeleteModel {}

class GatewayNameDeleteModel extends BaseGetDeleteModel {}

class ZOSModel extends Deployment {
    node_id: number;
}

class NodeContractCreateModel {
    node_id: number;
    hash: string;
    data: string;
    public_ip: number;
}

class NameContractCreateModel {
    name: string;
}
class ContractGetModel {
    id: number;
}

class ContractGetByNodeIdAndHashModel {
    node_id: number;
    hash: string;
}

class NodeContractsGetModel {
    node_id: number;
    state: ContractState;
}

class NameContractGetModel {
    name: string;
}

class NodeContractUpdateModel {
    id: number;
    hash: string;
    data: string;
}

class ContractCancelModel {
    id: number;
}

class TwinCreateModel {
    ip: string;
}

class TwinGetModel {
    id: number;
}

class TwinGetByAccountIdModel {
    public_key: string;
}

class TwinDeleteModel {
    id: number;
}

class WalletImportModel {
    name: string;
    secret: string;
}

class WalletBalanceByNameModel {
    name: string;
}

class WalletBalanceByAddressModel {
    address: string;
}

class WalletTransferModel {
    name: string;
    target_address: string;
    amount: number;
    asset: string;
    memo: string;
}

class WalletDeleteModel {
    name: string;
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
    TwinCreateModel,
    TwinGetModel,
    TwinGetByAccountIdModel,
    TwinDeleteModel,
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
