"use strict";
// ssd mounts under zmachine
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZmountResult = exports.Zmount = void 0;
// ONLY possible on SSD
class Zmount {
    size; // bytes
    challenge() {
        return this.size || "";
    }
}
exports.Zmount = Zmount;
class ZmountResult {
    volume_id;
}
exports.ZmountResult = ZmountResult;
