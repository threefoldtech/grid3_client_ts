import { Znet } from "./znet";
import { Zmount, ZmountResult } from "./zmount";
import { Zmachine, ZmachineResult } from "./zmachine";
import { Zdb, ZdbResult } from "./zdb";
import { PublicIP } from "./ipv4";
import { GatewayFQDNProxy, GatewayNameProxy } from "./gateway";
import { QuantumSafeFS, QuantumSafeFSResult } from "./qsfs";
import { WorkloadDataResult } from "./workload_base";
import { PublicIPResult } from ".";
declare enum ResultStates {
    error = "error",
    ok = "ok",
    deleted = "deleted"
}
declare enum WorkloadTypes {
    zmachine = "zmachine",
    zmount = "zmount",
    network = "network",
    zdb = "zdb",
    ipv4 = "ipv4",
    gatewayfqdnproxy = "gateway-fqdn-proxy",
    gatewaynameproxy = "gateway-name-proxy",
    qsfs = "qsfs"
}
declare class DeploymentResult {
    created: number;
    state: ResultStates;
    message: string;
    data: ZmountResult | ZmachineResult | ZdbResult | PublicIPResult | QuantumSafeFSResult | WorkloadDataResult;
}
declare class Workload {
    version: number;
    name: string;
    type: WorkloadTypes;
    data: Zmount | Znet | Zmachine | Zdb | PublicIP | GatewayFQDNProxy | GatewayNameProxy | QuantumSafeFS;
    metadata: string;
    description: string;
    result: DeploymentResult;
    challenge(): string;
}
export { Workload, WorkloadTypes };
//# sourceMappingURL=workload.d.ts.map