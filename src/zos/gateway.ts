import { IsFQDN, IsBoolean, IsString, IsUrl, IsNotEmpty, ArrayNotEmpty } from "class-validator";
import { Expose } from "class-transformer";

import { WorkloadData, WorkloadDataResult } from "./workload_base";

class GatewayFQDNProxy extends WorkloadData {
    @Expose() @IsFQDN() fqdn: string;
    @Expose() @IsBoolean() tls_passthrough: boolean;
    @Expose() @ArrayNotEmpty() @IsUrl({ protocols: ["http", "https"] }, { each: true }) backends: string[];

    challenge() {
        let out = "";
        out += this.fqdn;
        out += this.tls_passthrough.toString();
        for (const backend of this.backends) {
            out += backend;
        }
        return out;
    }
}

class GatewayNameProxy extends WorkloadData {
    @Expose() @IsString() @IsNotEmpty() name: string;
    @Expose() @IsBoolean() tls_passthrough: boolean;
    @Expose() @ArrayNotEmpty() @IsUrl({ protocols: ["http", "https"] }, { each: true }) backends: string[];

    challenge() {
        let out = "";
        out += this.name;
        out += this.tls_passthrough.toString();
        for (const backend of this.backends) {
            out += backend;
        }
        return out;
    }
}

class GatewayResult extends WorkloadDataResult {}

export { GatewayFQDNProxy, GatewayNameProxy, GatewayResult };
