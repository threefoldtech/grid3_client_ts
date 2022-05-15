import { GatewayFQDNProxy, GatewayNameProxy, GatewayResult } from "./gateway";
import { PublicIPv4, PublicIPv4Result } from "./ipv4";
import { PublicIP, PublicIPResult } from "./public_ip";
import { QuantumSafeFS, QuantumSafeFSResult } from "./qsfs";
import { WorkloadDataResult } from "./workload_base";
import { Zdb, ZdbResult } from "./zdb";
import { Zmachine, ZmachineResult } from "./zmachine";
import { Zmount, ZmountResult } from "./zmount";
import { Znet } from "./znet";
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
    ip = "ip",
    gatewayfqdnproxy = "gateway-fqdn-proxy",
    gatewaynameproxy = "gateway-name-proxy",
    qsfs = "qsfs"
}
declare class DeploymentResult {
    created: number;
    state: ResultStates;
    message: string;
    data: ZmountResult | ZmachineResult | ZdbResult | PublicIPResult | PublicIPv4Result | QuantumSafeFSResult | WorkloadDataResult | GatewayResult;
}
declare class Workload {
    version: number;
    name: string;
    type: WorkloadTypes;
    data: Zmount | Znet | Zmachine | Zdb | PublicIP | PublicIPv4 | GatewayFQDNProxy | GatewayNameProxy | QuantumSafeFS;
    metadata: string;
    description: string;
    result: DeploymentResult;
    challenge(): string;
}
export { Workload, WorkloadTypes, DeploymentResult, ResultStates };
//# sourceMappingURL=workload.d.ts.map