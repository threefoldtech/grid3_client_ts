import { GatewayFQDNProxy, GatewayNameProxy } from "../zos/gateway";
import { Workload, WorkloadTypes } from "../zos/workload";
class GWPrimitive {
    createFQDN(fqdn, tls_passthrough, backends, name, metadata = "", description = "", version = 0) {
        const fqdnObj = new GatewayFQDNProxy();
        fqdnObj.fqdn = fqdn;
        fqdnObj.tls_passthrough = tls_passthrough;
        fqdnObj.backends = backends;
        const fqdn_workload = new Workload();
        fqdn_workload.version = version;
        fqdn_workload.name = name;
        fqdn_workload.type = WorkloadTypes.gatewayfqdnproxy;
        fqdn_workload.data = fqdnObj;
        fqdn_workload.metadata = metadata;
        fqdn_workload.description = description;
        return fqdn_workload;
    }
    updateFQDN(fqdn, tls_passthrough, backends, name, metadata = "", description = "", old_version = 1) {
        return this.createFQDN(fqdn, tls_passthrough, backends, name, metadata, description, old_version + 1);
    }
    createName(name, tls_passthrough, backends, metadata = "", description = "", version = 0) {
        const nameOnj = new GatewayNameProxy();
        nameOnj.name = name;
        nameOnj.tls_passthrough = tls_passthrough;
        nameOnj.backends = backends;
        const name_workload = new Workload();
        name_workload.version = version;
        name_workload.name = name;
        name_workload.type = WorkloadTypes.gatewaynameproxy;
        name_workload.data = nameOnj;
        name_workload.metadata = metadata;
        name_workload.description = description;
        return name_workload;
    }
    updateName(name, tls_passthrough, backends, metadata = "", description = "", old_version = 1) {
        return this.createName(name, tls_passthrough, backends, metadata, description, old_version + 1);
    }
}
export { GWPrimitive };
