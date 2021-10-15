import { Deployment } from "../zos/deployment";
//TODO: find a way to validate all fields are passed while casting data to any of these classes.
class DiskModel {
}
;
class QSFSDisk {
}
class NetworkModel {
}
class BaseGetDeleteModel {
}
class MachineModel {
}
class MachinesModel {
}
class AddMachineModel extends MachineModel {
}
class DeleteMachineModel {
}
class MachinesGetModel extends BaseGetDeleteModel {
}
class MachinesDeleteModel extends BaseGetDeleteModel {
}
class KubernetesNodeModel {
}
class K8SModel {
}
class K8SGetModel extends BaseGetDeleteModel {
}
class K8SDeleteModel extends BaseGetDeleteModel {
}
class AddWorkerModel extends KubernetesNodeModel {
}
class DeleteWorkerModel {
}
class ZDBModel {
}
class ZDBSModel {
}
class ZDBGetModel extends BaseGetDeleteModel {
}
class ZDBDeleteModel extends BaseGetDeleteModel {
}
class AddZDBModel extends ZDBModel {
}
class DeleteZDBModel extends DeleteWorkerModel {
}
class QSFSZDBSModel {
}
class QSFSZDBGetModel extends BaseGetDeleteModel {
}
class QSFSZDBDeleteModel extends BaseGetDeleteModel {
}
class DeployGatewayFQDNModel {
}
class DeployGatewayNameModel {
}
class ZOSModel extends Deployment {
}
export { DiskModel, NetworkModel, MachineModel, MachinesModel, MachinesGetModel, MachinesDeleteModel, AddMachineModel, DeleteMachineModel, KubernetesNodeModel, K8SModel, K8SGetModel, K8SDeleteModel, AddWorkerModel, DeleteWorkerModel, ZDBModel, ZDBSModel, ZDBGetModel, ZDBDeleteModel, AddZDBModel, DeleteZDBModel, DeployGatewayFQDNModel, DeployGatewayNameModel, ZOSModel, QSFSDisk, QSFSZDBSModel, QSFSZDBGetModel, QSFSZDBDeleteModel };
