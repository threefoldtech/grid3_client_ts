import { Znet } from "./znet";
import { Zmount, ZmountResult } from "./zmount";
import { Zmachine, ZmachineResult } from "./zmachine";
import { Zdb, ZdbResult } from "./zdb";
import { PublicIP } from "./ipv4";
import { GatewayFQDNProxy, GatewayNameProxy, GatewayResult } from "./gateway";
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
    gatewayfqdnproxy = "gatewayfqdnproxy",
    gatewaynameproxy = "gatewaynameproxy"
}
declare class DeploymentResult {
    created: number;
    state: ResultStates;
    error: string;
    data: string;
}
declare class Workload {
    version: number;
    name: string;
    type: WorkloadTypes;
    data: Zmount | Znet | Zmachine | Zdb | PublicIP | GatewayFQDNProxy | GatewayNameProxy;
    metadata: string;
    description: string;
    result: DeploymentResult;
    challenge(): string;
}
declare type WorkloadData = Zmount | Zdb | Zmachine | Znet | GatewayFQDNProxy | GatewayNameProxy;
declare type WorkloadDataResult = ZmountResult | ZdbResult | ZmachineResult | GatewayResult;
export { Workload, WorkloadTypes, WorkloadData, WorkloadDataResult };
