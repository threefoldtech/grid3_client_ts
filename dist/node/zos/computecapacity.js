"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComputeCapacity = void 0;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
class ComputeCapacity {
    cpu;
    memory; // in bytes
    challenge() {
        let out = "";
        out += this.cpu;
        out += this.memory;
        return out;
    }
}
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(32),
    __metadata("design:type", Number)
], ComputeCapacity.prototype, "cpu", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(256 * 1024 ** 2),
    (0, class_validator_1.Max)(256 * 1024 ** 3),
    __metadata("design:type", Number)
], ComputeCapacity.prototype, "memory", void 0);
exports.ComputeCapacity = ComputeCapacity;
