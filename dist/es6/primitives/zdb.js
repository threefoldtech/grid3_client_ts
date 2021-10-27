import { Zdb, ZdbModes } from "../zos/zdb";
import { WorkloadTypes, Workload } from "../zos/workload";
class ZdbPrimitive {
    create(name, size, mode = ZdbModes.seq, password, publicIpv6, metadata = "", description = "", version = 0) {
        const zdb = new Zdb();
        zdb.size = size;
        zdb.mode = mode;
        zdb.password = password;
        zdb.public = publicIpv6;
        const zdb_workload = new Workload();
        zdb_workload.version = version;
        zdb_workload.name = name;
        zdb_workload.type = WorkloadTypes.zdb;
        zdb_workload.data = zdb;
        zdb_workload.metadata = metadata;
        zdb_workload.description = description;
        return zdb_workload;
    }
    update(name, size, mode = ZdbModes.seq, password, publicIpv6, metadata = "", description = "", version = 1) {
        return this.create(name, size, mode, password, publicIpv6, metadata, description, version);
    }
}
export { ZdbPrimitive };
