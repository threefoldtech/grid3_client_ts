// ssd mounts under zmachine

// ONLY possible on SSD
class Zmount {
    size: number; // bytes

    challenge() {
        return this.size || "";
    }
}

class ZmountResult {
    volume_id: string;
}
export { Zmount, ZmountResult };
