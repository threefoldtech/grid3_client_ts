import { Expose, Transform, Type } from "class-transformer";
import { IsDefined, IsEnum, IsInt, IsNotEmpty, IsString, Min, ValidateNested } from "class-validator";

import { GatewayFQDNProxy, GatewayNameProxy, GatewayResult } from "./gateway";
import { PublicIP, PublicIPResult } from "./public_ip";
import { QuantumSafeFS, QuantumSafeFSResult } from "./qsfs";
import { WorkloadData, WorkloadDataResult } from "./workload_base";
import { Zdb, ZdbResult } from "./zdb";
import { Zmachine, ZmachineResult } from "./zmachine";
import { Zmount, ZmountResult } from "./zmount";
import { Znet } from "./znet";

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
    ip = "ip",
    gatewayfqdnproxy = "gateway-fqdn-proxy",
    gatewaynameproxy = "gateway-name-proxy",
    qsfs = "qsfs",
}

// enum Right {
//     restart,
//     delete,
//     stats,
//     logs,
// }
// class ACE {
//     twin_ids: number[];
//     rights: Right[];
// }

class DeploymentResult {
    @Expose() created: number;
    @Expose() @Transform(({ value }) => ResultStates[value]) state: ResultStates;
    @Expose() message: string;
    @Expose()
    @Type(() => WorkloadDataResult, {
        discriminator: {
            property: "__type",
            subTypes: [
                { value: ZmountResult, name: WorkloadTypes.zmount },
                { value: WorkloadDataResult, name: WorkloadTypes.network },
                { value: ZmachineResult, name: WorkloadTypes.zmachine },
                { value: ZdbResult, name: WorkloadTypes.zdb },
                { value: PublicIPResult, name: WorkloadTypes.ip },
                { value: WorkloadDataResult, name: WorkloadTypes.gatewayfqdnproxy },
                { value: WorkloadDataResult, name: WorkloadTypes.gatewaynameproxy },
                { value: QuantumSafeFSResult, name: WorkloadTypes.qsfs },
            ],
        },
    })
    data:
        | ZmountResult
        | ZmachineResult
        | ZdbResult
        | PublicIPResult
        | QuantumSafeFSResult
        | WorkloadDataResult
        | GatewayResult;
}

class Workload {
    @Expose() @IsInt() @Min(0) version: number;
    @Expose() @IsString() @IsNotEmpty() name: string;
    @Expose()
    @Transform(({ value }) => WorkloadTypes[value.replace(/-/g, "")]) // remove the '-' from the Workloadtype's value to match the key in the reverse parsing from json to obj
    @IsEnum(WorkloadTypes)
    type: WorkloadTypes;
    @Expose()
    @ValidateNested()
    @Type(() => WorkloadData, {
        discriminator: {
            property: "__type",
            subTypes: [
                { value: Zmount, name: WorkloadTypes.zmount },
                { value: Znet, name: WorkloadTypes.network },
                { value: Zmachine, name: WorkloadTypes.zmachine },
                { value: Zdb, name: WorkloadTypes.zdb },
                { value: PublicIP, name: WorkloadTypes.ip },
                { value: GatewayFQDNProxy, name: WorkloadTypes.gatewayfqdnproxy },
                { value: GatewayNameProxy, name: WorkloadTypes.gatewaynameproxy },
                { value: QuantumSafeFS, name: WorkloadTypes.qsfs },
            ],
        },
    })
    data: Zmount | Znet | Zmachine | Zdb | PublicIP | GatewayFQDNProxy | GatewayNameProxy | QuantumSafeFS;

    @Expose() @IsString() @IsDefined() metadata: string;
    @Expose() @IsString() @IsDefined() description: string;
    @Expose() @Type(() => DeploymentResult) result: DeploymentResult;

    challenge(): string {
        let out = "";
        out += this.version;
        out += this.type.toString();
        out += this.metadata;
        out += this.description;
        out += this.data.challenge();

        return out;
    }
}

export { Workload, WorkloadTypes, DeploymentResult, ResultStates };
