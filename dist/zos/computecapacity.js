"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComputeCapacity = void 0;
class ComputeCapacity {
    // cpu cores, minimal 10 cpu_centi_core
    // always reserved with overprovisioning of about 1/4-1/6
    cpu;
    // memory in bytes, minimal 100 MB
    // always reserved
    memory;
    // min disk size reserved (to make sure you have growth potential)
    // when reserved it means you payment
    // if you use more, you pay for it
    challenge() {
        let out = "";
        out += this.cpu || "";
        out += this.memory || "";
        return out;
    }
}
exports.ComputeCapacity = ComputeCapacity;
