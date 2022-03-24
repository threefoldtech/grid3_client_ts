import { Expose } from "class-transformer";
import { IsInt, Max, Min } from "class-validator";

class ComputeCapacity {
    @Expose() @IsInt() @Min(1) @Max(32) cpu: number;
    @Expose() @IsInt() @Min(256 * 1024 ** 2) @Max(256 * 1024 ** 3) memory: number; // in bytes

    challenge(): string {
        let out = "";
        out += this.cpu;
        out += this.memory;
        return out;
    }
}

export { ComputeCapacity };
