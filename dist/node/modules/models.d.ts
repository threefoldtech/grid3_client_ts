import { Deployment } from "../zos/deployment";
import { ZdbModes, DeviceTypes } from "../zos/zdb";
declare class DiskModel {
    name: string;
    size: number;
    mountpoint: string;
}
declare class QSFSDisk {
    qsfs_zdbs_name: string;
    name: string;
    prefix: string;
    encryption_key: string;
    mountpoint: string;
}
declare class NetworkModel {
    name: string;
    ip_range: string;
}
declare class BaseGetDeleteModel {
    name: string;
}
declare class MachineModel {
    name: string;
    node_id: number;
    disks: DiskModel[];
    qsfs_disks: QSFSDisk[];
    public_ip: boolean;
    planetary: boolean;
    cpu: number;
    memory: number;
    rootfs_size: number;
    flist: string;
    entrypoint: string;
    env: Record<string, unknown>;
}
declare class MachinesModel {
    name: string;
    network: NetworkModel;
    machines: MachineModel[];
    metadata: string;
    description: string;
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
    qsfs_disks: QSFSDisk[];
    public_ip: boolean;
    planetary: boolean;
}
declare class K8SModel {
    name: string;
    secret: string;
    network: NetworkModel;
    masters: KubernetesNodeModel[];
    workers: KubernetesNodeModel[];
    metadata: string;
    description: string;
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
    disk_type: DeviceTypes;
    public: boolean;
    namespace: string;
    password: string;
}
declare class ZDBSModel {
    name: string;
    zdbs: ZDBModel[];
    metadata: string;
    description: string;
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
    disk_type: DeviceTypes;
    namespace: string;
    password: string;
    metadata: string;
    description: string;
}
declare class QSFSZDBGetModel extends BaseGetDeleteModel {
}
declare class QSFSZDBDeleteModel extends BaseGetDeleteModel {
}
declare class DeployGatewayFQDNModel {
    name: string;
    node_id: number;
    fqdn: string;
    tls_passthrough: boolean;
    backends: string[];
}
declare class DeployGatewayNameModel {
    name: string;
    node_id: number;
    tls_passthrough: boolean;
    backends: string[];
}
declare class ZOSModel extends Deployment {
    node_id: number;
}
export { DiskModel, NetworkModel, MachineModel, MachinesModel, MachinesGetModel, MachinesDeleteModel, AddMachineModel, DeleteMachineModel, KubernetesNodeModel, K8SModel, K8SGetModel, K8SDeleteModel, AddWorkerModel, DeleteWorkerModel, ZDBModel, ZDBSModel, ZDBGetModel, ZDBDeleteModel, AddZDBModel, DeleteZDBModel, DeployGatewayFQDNModel, DeployGatewayNameModel, ZOSModel, QSFSDisk, QSFSZDBSModel, QSFSZDBGetModel, QSFSZDBDeleteModel };
//# sourceMappingURL=models.d.ts.map