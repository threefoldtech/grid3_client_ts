import { IsInt, Min } from "class-validator";

// ssd mounts under zmachine

// ONLY possible on SSD
class Zmount {
    @IsInt() @Min(1) size: number; // bytes

    challenge() {
        return this.size;
    }
}

class ZmountResult {
    volume_id: string;
}
export { Zmount, ZmountResult };
