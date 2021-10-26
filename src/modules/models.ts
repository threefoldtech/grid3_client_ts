import { Deployment } from "../zos/deployment";
import { ZdbModes } from "../zos/zdb";

//TODO: find a way to validate all fields are passed while casting data to any of these classes.
class DiskModel {
    name: string;
    size: number; // in GB
    mountpoint: string;
}

class QSFSDisk {
    qsfs_zdbs_name: string;
    name: string;
    prefix: string;
    encryption_key: string;
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
    qsfs_disks: QSFSDisk[];
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
    qsfs_disks: QSFSDisk[];
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
    public: boolean;
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

class DeployGatewayFQDNModel {
    name: string;
    node_id: number;
    fqdn: string;
    tls_passthrough: boolean;
    backends: string[];
}

class DeployGatewayNameModel {
    name: string;
    node_id: number;
    tls_passthrough: boolean;
    backends: string[];
}

class ZOSModel extends Deployment {
    node_id: number;
}

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
    DeployGatewayFQDNModel,
    DeployGatewayNameModel,
    ZOSModel,
    QSFSDisk,
    QSFSZDBSModel,
    QSFSZDBGetModel,
    QSFSZDBDeleteModel,
};
