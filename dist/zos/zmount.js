// ssd mounts under zmachine
// ONLY possible on SSD
class Zmount {
    size; // bytes
    challenge() {
        return this.size || "";
    }
}
class ZmountResult {
    volume_id;
}
export { Zmount, ZmountResult };
