"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZdbPrimitive = void 0;
const workload_1 = require("../zos/workload");
const zdb_1 = require("../zos/zdb");
class ZdbPrimitive {
    create(name, size, mode = zdb_1.ZdbModes.seq, password, publicNamespace, metadata = "", description = "", version = 0) {
        const zdb = new zdb_1.Zdb();
        zdb.size = size * 1024 ** 3;
        zdb.mode = mode;
        zdb.password = password;
        zdb.public = publicNamespace;
        const zdb_workload = new workload_1.Workload();
        zdb_workload.version = version;
        zdb_workload.name = name;
        zdb_workload.type = workload_1.WorkloadTypes.zdb;
        zdb_workload.data = zdb;
        zdb_workload.metadata = metadata;
        zdb_workload.description = description;
        return zdb_workload;
    }
    update(name, size, mode = zdb_1.ZdbModes.seq, password, publicNamespace, metadata = "", description = "", version = 1) {
        return this.create(name, size, mode, password, publicNamespace, metadata, description, version);
    }
}
exports.ZdbPrimitive = ZdbPrimitive;
