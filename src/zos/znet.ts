import { Expose, Type } from "class-transformer";
import { ArrayNotEmpty, IsDefined, IsInt, IsNotEmpty, IsString, ValidateNested } from "class-validator";

import { WorkloadData } from "./workload_base";

class Peer {
    @Expose() @IsString() @IsNotEmpty() subnet: string;
    @Expose() @IsString() @IsNotEmpty() wireguard_public_key: string;
    @Expose() @IsString({ each: true }) @ArrayNotEmpty() allowed_ips: string[];
    @Expose() @IsString() @IsDefined() endpoint: string;

    challenge(): string {
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

class Znet extends WorkloadData {
    @Expose() @IsString() @IsNotEmpty() subnet: string;
    @Expose() @IsString() @IsNotEmpty() ip_range: string;
    @Expose() @IsString() @IsNotEmpty() wireguard_private_key: string;
    @Expose() @IsInt() @IsNotEmpty() wireguard_listen_port: number;
    @Expose() @Type(() => Peer) @ValidateNested({ each: true }) peers: Peer[];

    challenge(): string {
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
