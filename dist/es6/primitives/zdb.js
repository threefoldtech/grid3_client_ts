import { Workload, WorkloadTypes } from "../zos/workload";
import { Zdb, ZdbModes } from "../zos/zdb";
class ZdbPrimitive {
    create(name, size, mode = ZdbModes.seq, password, publicNamespace, metadata = "", description = "", version = 0) {
        const zdb = new Zdb();
        zdb.size = size * Math.pow(1024, 3);
        zdb.mode = mode;
        zdb.password = password;
        zdb.public = publicNamespace;
        const zdb_workload = new Workload();
        zdb_workload.version = version;
        zdb_workload.name = name;
        zdb_workload.type = WorkloadTypes.zdb;
        zdb_workload.data = zdb;
        zdb_workload.metadata = metadata;
        zdb_workload.description = description;
        return zdb_workload;
    }
    update(name, size, mode = ZdbModes.seq, password, publicNamespace, metadata = "", description = "", version = 1) {
        return this.create(name, size, mode, password, publicNamespace, metadata, description, version);
    }
}
export { ZdbPrimitive };
