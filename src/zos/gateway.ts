import { IsFQDN, IsBoolean, IsString, IsUrl, IsNotEmpty, ArrayNotEmpty } from "class-validator";
import { Expose } from "class-transformer";

import { WorkloadBaseData } from "./workload_base";

class GatewayFQDNProxy extends WorkloadBaseData {
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

class GatewayNameProxy extends WorkloadBaseData {
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

class GatewayResult {}

export { GatewayFQDNProxy, GatewayNameProxy, GatewayResult };
