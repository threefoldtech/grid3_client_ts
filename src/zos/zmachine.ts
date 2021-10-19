import { IsString, IsNotEmpty, IsIP, IsBoolean, IsInt, Min, ValidateNested } from "class-validator";

import { ComputeCapacity } from "./computecapacity";

class ZNetworkInterface {
    @IsString() @IsNotEmpty() network: string;
    @IsIP() @IsNotEmpty() ip: string;
}

class ZmachineNetwork {
    @IsString() @IsNotEmpty() public_ip: string;
    @ValidateNested({ each: true }) interfaces: ZNetworkInterface[];
    @IsBoolean() planetary: boolean;

    challenge() {
        let out = "";
        out += this.public_ip;
        out += this.planetary.toString();
        for (let i = 0; i < this.interfaces.length; i++) {
            out += this.interfaces[i].network;
            out += this.interfaces[i].ip;
        }
        return out;
    }
}

class Mount {
    @IsString() @IsNotEmpty() name: string;
    @IsString() @IsNotEmpty() mountpoint: string;

    challenge() {
        let out = "";
        out += this.name;
        out += this.mountpoint;
        return out;
    }
}

class Zmachine {
    @IsString() @IsNotEmpty() flist: string; // if full url means custom flist meant for containers, if just name should be an official vm
    @ValidateNested() network: ZmachineNetwork;
    @IsInt() @Min(1024 * 1024 * 250) size: number;
    @ValidateNested() compute_capacity: ComputeCapacity;
    @ValidateNested({ each: true }) mounts: Mount[];
    @IsString() @IsNotEmpty() entrypoint: string; //how to invoke that in a vm?
    env: Record<string, unknown>; //environment for the zmachine

    challenge() {
        let out = "";
        out += this.flist;
        out += this.network.challenge();
        out += this.size || "";
        out += this.compute_capacity.challenge();
        for (let i = 0; i < this.mounts.length; i++) {
            out += this.mounts[i].challenge();
        }
        out += this.entrypoint;
        for (const key of Object.keys(this.env).sort()) {
            out += key;
            out += "=";
            out += this.env[key];
        }
        return out;
    }
}

// response of the deployment
class ZmachineResult {
    // name unique per deployment, re-used in request & response
    id = "";
    ip = "";
}

export { Zmachine, ZmachineNetwork, ZNetworkInterface, Mount, ZmachineResult };
