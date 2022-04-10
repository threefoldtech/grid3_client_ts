import { Workload, WorkloadTypes } from "../zos/workload";
import { Mount } from "../zos/zmachine";
import { Zmount } from "../zos/zmount";

class DiskPrimitive {
    createMount(name: string, mountpoint: string): Mount {
        const mount = new Mount();
        mount.name = name;
        mount.mountpoint = mountpoint;
        return mount;
    }
    create(size: number, name: string, metadata = "", description = "", version = 0): Workload {
        const zmount = new Zmount();
        zmount.size = size * 1024 ** 3;

        const zmount_workload = new Workload();
        zmount_workload.version = version;
        zmount_workload.name = name;
        zmount_workload.type = WorkloadTypes.zmount;
        zmount_workload.data = zmount;
        zmount_workload.metadata = metadata;
        zmount_workload.description = description;
        return zmount_workload;
    }
    update(size: number, name: string, metadata = "", description = "", old_version = 1): Workload {
        return this.create(size, name, metadata, description, old_version + 1);
    }
}
export { DiskPrimitive };
