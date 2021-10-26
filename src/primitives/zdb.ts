import { Zdb, ZdbModes } from "../zos/zdb";
import { WorkloadTypes, Workload } from "../zos/workload";

class ZdbPrimitive {
    create(
        name: string,
        size: number,
        mode: ZdbModes = ZdbModes.seq,
        password: string,
        pub: boolean,
        metadata = "",
        description = "",
        version = 0,
    ): Workload {
        const zdb = new Zdb();
        zdb.size = size;
        zdb.mode = mode;
        zdb.password = password;
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
    update(
        name: string,
        size: number,
        mode: ZdbModes = ZdbModes.seq,
        password: string,
        pub: boolean,
        metadata = "",
        description = "",
        version = 1,
    ): Workload {
        return this.create(name, size, mode, password, pub, metadata, description, version);
    }
}
export { ZdbPrimitive };
