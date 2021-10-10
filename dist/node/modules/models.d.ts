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
export { VirtualMachineDisk, Machines, MachinesGet, MachinesDelete, K8S, K8SGet, K8SDelete, AddWorker, DeleteWorker, ZDBS, ZDBGet, ZDBDelete, AddZDB, DeleteZDB, DeployGatewayFQDN, DeployGatewayName, ZOS, };
//# sourceMappingURL=models.d.ts.map