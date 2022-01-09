import { PublicIP } from "../zos/public_ip";
import { Workload, WorkloadTypes } from "../zos/workload";

class PublicIPPrimitive {
    create(name: string, metadata = "", description = "", version = 0, ipv4 = false, ipv6 = false): Workload {
        const public_ip = new PublicIP();
        public_ip.v4 = ipv4;
        public_ip.v6 = ipv6;
        const ip_workload = new Workload();
        ip_workload.version = version;
        ip_workload.name = name;
        ip_workload.type = WorkloadTypes.ip;
        ip_workload.data = public_ip;
        ip_workload.metadata = metadata;
        ip_workload.description = description;
        return ip_workload;
    }
    update(name: string, metadata = "", description = "", old_version = 1): Workload {
        return this.create(name, metadata, description, old_version + 1);
    }
}
export { PublicIPPrimitive };
