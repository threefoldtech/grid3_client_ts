import { IsString, IsNotEmpty, IsDefined, IsInt, Min, ValidateNested, IsEnum } from "class-validator";
import { Expose, Transform, Type } from "class-transformer";

import { Znet } from "./znet";
import { Zmount, ZmountResult } from "./zmount";
import { Zmachine, ZmachineResult } from "./zmachine";
import { Zdb, ZdbResult } from "./zdb";
import { PublicIP } from "./ipv4";
import { GatewayFQDNProxy, GatewayNameProxy, GatewayResult } from "./gateway";
import { QuantumSafeFS } from "./qsfs";
import { WorkloadBaseData } from "./workload_base";

enum ResultStates {
    error = "error",
    ok = "ok",
    deleted = "deleted",
}

enum WorkloadTypes {
    zmachine = "zmachine",
    zmount = "zmount",
    network = "network",
    zdb = "zdb",
    ipv4 = "ipv4",
    gatewayfqdnproxy = "gateway-fqdn-proxy",
    gatewaynameproxy = "gateway-name-proxy",
    qsfs = "qsfs",
}

enum Right {
    restart,
    delete,
    stats,
    logs,
}
class ACE {
    twin_ids: number[];
    rights: Right[];
}

class DeploymentResult {
    created: number;
    state: ResultStates;
    error = "";
    data = "";
}


class Workload {
    @Expose() @IsInt() @Min(0) version: number;
    @Expose() @IsString() @IsNotEmpty() name: string;
    @Expose() @Transform(({ value }) => WorkloadTypes[value]) @IsEnum(WorkloadTypes) type: WorkloadTypes;
    @Expose() @ValidateNested() @Type(() => WorkloadBaseData, {
        discriminator: {
            property: '__type',
            subTypes: [
                { value: Zmount, name: WorkloadTypes.zmount },
                { value: Znet, name: WorkloadTypes.network },
                { value: Zmachine, name: WorkloadTypes.zmachine },
                { value: Zdb, name: WorkloadTypes.zdb },
                { value: PublicIP, name: WorkloadTypes.ipv4 },
                { value: GatewayFQDNProxy, name: WorkloadTypes.gatewayfqdnproxy },
                { value: GatewayNameProxy, name: WorkloadTypes.gatewaynameproxy },
                { value: QuantumSafeFS, name: WorkloadTypes.qsfs },
            ],
        },
    }) data:
        | Zmount
        | Znet
        | Zmachine
        | Zdb
        | PublicIP
        | GatewayFQDNProxy
        | GatewayNameProxy
        | QuantumSafeFS;

    @Expose() @IsString() @IsDefined() metadata: string;
    @Expose() @IsString() @IsDefined() description: string;


    result: DeploymentResult;

    challenge() {
        let out = "";
        out += this.version;
        out += this.type.toString();
        out += this.metadata;
        out += this.description;
        out += this.data.challenge();

        return out;
    }
}

type WorkloadData = Zmount | Zdb | Zmachine | Znet | GatewayFQDNProxy | GatewayNameProxy;
type WorkloadDataResult = ZmountResult | ZdbResult | ZmachineResult | GatewayResult;

export { Workload, WorkloadTypes, WorkloadData, WorkloadDataResult };
