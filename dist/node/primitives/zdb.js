"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZdbPrimitive = void 0;
const zdb_1 = require("../zos/zdb");
const workload_1 = require("../zos/workload");
class ZdbPrimitive {
    create(name, size, mode = zdb_1.ZdbModes.seq, password, pub, metadata = "", description = "", version = 0) {
        const zdb = new zdb_1.Zdb();
        zdb.size = size;
        zdb.mode = mode;
        zdb.password = password;
        zdb.public = pub;
        const zdb_workload = new workload_1.Workload();
        zdb_workload.version = version;
        zdb_workload.name = name;
        zdb_workload.type = workload_1.WorkloadTypes.zdb;
        zdb_workload.data = zdb;
        zdb_workload.metadata = metadata;
        zdb_workload.description = description;
        return zdb_workload;
    }
    update(name, size, mode = zdb_1.ZdbModes.seq, password, pub, metadata = "", description = "", version = 1) {
        return this.create(name, size, mode, password, pub, metadata, description, version);
    }
}
exports.ZdbPrimitive = ZdbPrimitive;
