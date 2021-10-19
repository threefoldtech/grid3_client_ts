"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComputeCapacity = void 0;
const class_validator_1 = require("class-validator");
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
        out += this.cpu;
        out += this.memory;
        return out;
    }
}
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1)
], ComputeCapacity.prototype, "cpu", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1024 * 1024 * 250)
], ComputeCapacity.prototype, "memory", void 0);
exports.ComputeCapacity = ComputeCapacity;
