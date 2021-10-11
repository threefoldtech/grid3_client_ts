import { Deployment } from "../zos/deployment";
class VirtualMachineDisk {
}
;
class Network {
}
class BaseGetDelete {
}
class Machines {
}
class MachinesGet extends BaseGetDelete {
}
class MachinesDelete extends BaseGetDelete {
}
class KubernetesNode {
}
class K8S {
}
class K8SGet extends BaseGetDelete {
}
class K8SDelete extends BaseGetDelete {
}
class AddWorker extends KubernetesNode {
}
class DeleteWorker {
}
class ZDB {
}
class ZDBS {
}
class ZDBGet extends BaseGetDelete {
}
class ZDBDelete extends BaseGetDelete {
}
class AddZDB extends ZDB {
}
class DeleteZDB extends DeleteWorker {
}
class DeployGatewayFQDN {
}
class DeployGatewayName {
}
class ZOS extends Deployment {
}
export { VirtualMachineDisk, Machines, MachinesGet, MachinesDelete, KubernetesNode, K8S, K8SGet, K8SDelete, AddWorker, DeleteWorker, ZDBS, ZDBGet, ZDBDelete, AddZDB, DeleteZDB, DeployGatewayFQDN, DeployGatewayName, ZOS, };
