import { Expose } from "class-transformer";
import { IsInt, Min } from "class-validator";

class ComputeCapacity {
    @Expose() @IsInt() @Min(1) cpu: number;
    @Expose() @IsInt() @Min(1024 * 1024 * 250) memory: number; // in bytes

    challenge(): string {
        let out = "";
        out += this.cpu;
        out += this.memory;
        return out;
    }
}

export { ComputeCapacity };
