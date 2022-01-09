// // TODO:----------------------- deprecated ---------------------------------//

import { PublicIPv4 } from "../zos/ipv4";
import { Workload, WorkloadTypes } from "../zos/workload";

class IPv4Primitive {
    create(name: string, metadata = "", description = "", version = 0): Workload {
        const public_ip = new PublicIPv4();
        const ipv4_workload = new Workload();
        ipv4_workload.version = version;
        ipv4_workload.name = name;
        ipv4_workload.type = WorkloadTypes.ipv4;
        ipv4_workload.data = public_ip;
        ipv4_workload.metadata = metadata;
        ipv4_workload.description = description;
        return ipv4_workload;
    }
    update(name: string, metadata = "", description = "", old_version = 1): Workload {
        return this.create(name, metadata, description, old_version + 1);
    }
}
export { IPv4Primitive };
