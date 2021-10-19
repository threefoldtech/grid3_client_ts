import { IsFQDN, IsBoolean, IsString, IsUrl, IsNotEmpty, ArrayNotEmpty } from "class-validator";

class GatewayFQDNProxy {
    @IsFQDN() fqdn: string;
    @IsBoolean() tls_passthrough: boolean;
    @ArrayNotEmpty() @IsUrl({ protocols: ["http", "https"] }, { each: true }) backends: string[];

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

class GatewayNameProxy {
    @IsString() @IsNotEmpty() name: string;
    @IsBoolean() tls_passthrough: boolean;
    @ArrayNotEmpty() @IsUrl({ protocols: ["http", "https"] }, { each: true }) backends: string[];

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
