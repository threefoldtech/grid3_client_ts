import { IsString, IsNotEmpty, IsIP, IsBoolean, IsInt, Min, ValidateNested } from "class-validator";
import { Expose, Type } from "class-transformer";

import { ComputeCapacity } from "./computecapacity";
import { WorkloadBaseData } from "./workload_base";


class ZNetworkInterface {
    @Expose() @IsString() @IsNotEmpty() network: string;
    @Expose() @IsIP() @IsNotEmpty() ip: string;
}

class ZmachineNetwork {
    @Expose() @IsString() @IsNotEmpty() public_ip: string;
    @Expose() @Type(() => ZNetworkInterface) @ValidateNested({ each: true }) interfaces: ZNetworkInterface[];
    @Expose() @IsBoolean() planetary: boolean;

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
    @Expose() @IsString() @IsNotEmpty() name: string;
    @Expose() @IsString() @IsNotEmpty() mountpoint: string;

    challenge() {
        let out = "";
        out += this.name;
        out += this.mountpoint;
        return out;
    }
}

class Zmachine extends WorkloadBaseData {
    @Expose() @IsString() @IsNotEmpty() flist: string;
    @Expose() @Type(() => ZmachineNetwork) @ValidateNested() network: ZmachineNetwork;
    @Expose() @IsInt() @Min(1024 * 1024 * 250) size: number; // in bytes
    @Expose() @Type(() => ComputeCapacity) @ValidateNested() compute_capacity: ComputeCapacity;
    @Expose() @Type(() => Mount) @ValidateNested({ each: true }) mounts: Mount[];
    @Expose() @IsString() @IsNotEmpty() entrypoint: string;
    @Expose() env: Record<string, unknown>;

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

class ZmachineResult {
    id = "";
    ip = "";
}

export { Zmachine, ZmachineNetwork, ZNetworkInterface, Mount, ZmachineResult };
