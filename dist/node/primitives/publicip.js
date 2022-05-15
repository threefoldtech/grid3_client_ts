"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicIPPrimitive = void 0;
const public_ip_1 = require("../zos/public_ip");
const workload_1 = require("../zos/workload");
class PublicIPPrimitive {
    create(name, metadata = "", description = "", version = 0, ipv4 = false, ipv6 = false) {
        const public_ip = new public_ip_1.PublicIP();
        public_ip.v4 = ipv4;
        public_ip.v6 = ipv6;
        const ip_workload = new workload_1.Workload();
        ip_workload.version = version;
        ip_workload.name = name;
        ip_workload.type = workload_1.WorkloadTypes.ip;
        ip_workload.data = public_ip;
        ip_workload.metadata = metadata;
        ip_workload.description = description;
        return ip_workload;
    }
    update(name, metadata = "", description = "", old_version = 1) {
        return this.create(name, metadata, description, old_version + 1);
    }
}
exports.PublicIPPrimitive = PublicIPPrimitive;
