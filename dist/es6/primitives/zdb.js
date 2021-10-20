import { Zdb, ZdbModes, DeviceTypes } from "../zos/zdb";
import { WorkloadTypes, Workload } from "../zos/workload";
class ZdbPrimitive {
    create(name, namespace, size, mode = ZdbModes.seq, password, type = DeviceTypes.hdd, pub, metadata = "", description = "", version = 0) {
        const zdb = new Zdb();
        zdb.namespace = namespace;
        zdb.size = size;
        zdb.mode = mode;
        zdb.password = password;
        zdb.disk_type = type;
        zdb.public = pub;
        const zdb_workload = new Workload();
        zdb_workload.version = version;
        zdb_workload.name = name;
        zdb_workload.type = WorkloadTypes.zdb;
        zdb_workload.data = zdb;
        zdb_workload.metadata = metadata;
        zdb_workload.description = description;
        return zdb_workload;
    }
    update(name, namespace, size, mode = ZdbModes.seq, password, type = DeviceTypes.hdd, pub, metadata = "", description = "", version = 1) {
        return this.create(name, namespace, size, mode, password, type, pub, metadata, description, version);
    }
}
export { ZdbPrimitive };
