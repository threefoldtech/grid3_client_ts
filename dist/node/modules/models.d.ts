import { Deployment } from "../zos/deployment";
import { ZdbModes, DeviceTypes } from "../zos/zdb";
declare class VirtualMachineDisk {
    name: string;
    size: number;
    mountpoint: string;
}
declare class Network {
    name: string;
    ip_range: string;
}
declare class BaseGetDelete {
    name: string;
}
declare class Machines {
    name: string;
    node_id: number;
    disks: VirtualMachineDisk[];
    network: Network;
    public_ip: boolean;
    cpu: number;
    memory: number;
    flist: string;
    entrypoint: string;
    metadata: string;
    description: string;
    env: Record<string, unknown>;
}
declare class MachinesGet extends BaseGetDelete {
}
declare class MachinesDelete extends BaseGetDelete {
}
declare class KubernetesNode {
    name: string;
    node_id: number;
    cpu: number;
    memory: number;
    disk_size: number;
    public_ip: boolean;
}
declare class K8S {
    name: string;
    secret: string;
    network: Network;
    masters: KubernetesNode[];
    workers: KubernetesNode[];
    metadata: string;
    description: string;
    ssh_key: string;
}
declare class K8SGet extends BaseGetDelete {
}
declare class K8SDelete extends BaseGetDelete {
}
declare class AddWorker extends KubernetesNode {
    deployment_name: string;
}
declare class DeleteWorker {
    deployment_name: string;
    name: string;
}
declare class ZDB {
    name: string;
    node_id: number;
    mode: ZdbModes;
    disk_size: number;
    disk_type: DeviceTypes;
    public: boolean;
    namespace: string;
    password: string;
}
declare class ZDBS {
    name: string;
    zdbs: ZDB[];
    metadata: string;
    description: string;
}
declare class ZDBGet extends BaseGetDelete {
}
declare class ZDBDelete extends BaseGetDelete {
}
declare class AddZDB extends ZDB {
    deployment_name: string;
}
declare class DeleteZDB extends DeleteWorker {
}
declare class NodeContractCreate {
    node_id: number;
    hash: string;
    data: string;
    public_ip: number;
}
declare class NameContractCreate {
    name: string;
}
declare class ContractGet {
    id: number;
}
declare class NodeContractUpdate {
    id: number;
    hash: string;
    data: string;
}
declare class ContractCancel {
    id: number;
}
declare class TwinCreate {
    ip: string;
}
declare class TwinGet {
    id: number;
}
declare class TwinDelete {
    id: number;
}
declare class WalletImport {
    name: string;
    secret: string;
}
declare class WalletBalanceByName {
    name: string;
}
declare class WalletBalanceByAddress {
    address: string;
}
declare class WalletTransfer {
    name: string;
    target_address: string;
    amount: number;
    asset: string;
    memo: string;
}
declare class WalletDelete {
    name: string;
}
declare class WalletGet extends WalletDelete {
}
declare class DeployGatewayFQDN {
    name: string;
    node_id: number;
    fqdn: string;
    tls_passthrough: boolean;
    backends: string[];
}
declare class DeployGatewayName {
    name: string;
    node_id: number;
    tls_passthrough: boolean;
    backends: string[];
}
declare class ZOS extends Deployment {
    node_id: number;
}
export { VirtualMachineDisk, Machines, MachinesGet, MachinesDelete, K8S, K8SGet, K8SDelete, AddWorker, DeleteWorker, ZDBS, ZDBGet, ZDBDelete, AddZDB, DeleteZDB, NodeContractCreate, NameContractCreate, ContractGet, NodeContractUpdate, ContractCancel, TwinCreate, TwinGet, TwinDelete, WalletImport, WalletBalanceByName, WalletBalanceByAddress, WalletTransfer, WalletDelete, WalletGet, DeployGatewayFQDN, DeployGatewayName, ZOS, };
//# sourceMappingURL=models.d.ts.map