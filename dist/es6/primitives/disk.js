import { Workload, WorkloadTypes } from "../zos/workload";
import { Mount } from "../zos/zmachine";
import { Zmount } from "../zos/zmount";
class DiskPrimitive {
    createMount(name, mountpoint) {
        const mount = new Mount();
        mount.name = name;
        mount.mountpoint = mountpoint;
        return mount;
    }
    create(size, name, metadata = "", description = "", version = 0) {
        const zmount = new Zmount();
        zmount.size = size * Math.pow(1024, 3);
        const zmount_workload = new Workload();
        zmount_workload.version = version;
        zmount_workload.name = name;
        zmount_workload.type = WorkloadTypes.zmount;
        zmount_workload.data = zmount;
        zmount_workload.metadata = metadata;
        zmount_workload.description = description;
        return zmount_workload;
    }
    update(size, name, metadata = "", description = "", old_version = 1) {
        return this.create(size, name, metadata, description, old_version + 1);
    }
}
export { DiskPrimitive };
