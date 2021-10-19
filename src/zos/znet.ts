import { IsString, IsNotEmpty, ArrayNotEmpty, IsPort, IsDefined, ValidateNested } from "class-validator";

// is a remote wireguard client which can connect to this node
class Peer {
    // is another class C in same class B as above
    @IsString() @IsNotEmpty() subnet: string;
    // wireguard public key, curve25519
    @IsString() @IsNotEmpty() wireguard_public_key: string;
    @IsString({ each: true }) @ArrayNotEmpty() allowed_ips: string[];
    // ipv4 or ipv6
    // can be empty, one of the 2 need to be filled in though
    @IsString() @IsDefined() endpoint: string;

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

// wg network reservation (znet)
class Znet {
    // unique nr for each network chosen, this identified private networks as connected to a container or vm or ...
    // corresponds to the 2nd number of a class B ipv4 address
    // is a class C of a chosen class B
    // form: e.g. 192.168.16.0/24
    // needs to be a private subnet
    @IsString() @IsNotEmpty() subnet: string;
    @IsString() @IsNotEmpty() ip_range: string;
    // wireguard private key, curve25519
    @IsString() @IsNotEmpty() wireguard_private_key: string;
    //>1024?
    @IsPort() @IsNotEmpty() wireguard_listen_port: number;
    @ValidateNested({ each: true }) @ArrayNotEmpty() peers: Peer[];

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
