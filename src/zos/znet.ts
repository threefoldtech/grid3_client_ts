import { IsString, IsNotEmpty, ArrayNotEmpty, IsPort, IsDefined, ValidateNested } from "class-validator";
import { Expose, Type } from "class-transformer";

import { WorkloadBaseData } from "./workload_base";

class Peer {
    @Expose() @IsString() @IsNotEmpty() subnet: string;
    @Expose() @IsString() @IsNotEmpty() wireguard_public_key: string;
    @Expose() @IsString({ each: true }) @ArrayNotEmpty() allowed_ips: string[];
    @Expose() @IsString() @IsDefined() endpoint: string;

    challenge() {
        let out = "";
        out += this.wireguard_public_key;
        out += this.endpoint;
        out += this.subnet;

        for (let i = 0; i < this.allowed_ips.length; i++) {
            out += this.allowed_ips[i];
        }
        return out;
    }
}

class Znet extends WorkloadBaseData {
    @Expose() @IsString() @IsNotEmpty() subnet: string;
    @Expose() @IsString() @IsNotEmpty() ip_range: string;
    @Expose() @IsString() @IsNotEmpty() wireguard_private_key: string;
    @Expose() @IsPort() @IsNotEmpty() wireguard_listen_port: number;
    @Expose() @Type(() => Peer) @ValidateNested({ each: true }) @ArrayNotEmpty() peers: Peer[];

    challenge() {
        let out = "";
        out += this.ip_range;
        out += this.subnet;
        out += this.wireguard_private_key;
        out += this.wireguard_listen_port;

        for (let i = 0; i < this.peers.length; i++) {
            out += this.peers[i].challenge();
        }
        return out;
    }
}

export { Znet, Peer };
