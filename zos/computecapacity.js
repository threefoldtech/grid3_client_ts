"use strict";
exports.__esModule = true;
exports.ComputeCapacity = void 0;
var ComputeCapacity = /** @class */ (function () {
    function ComputeCapacity() {
    }
    // min disk size reserved (to make sure you have growth potential)
    // when reserved it means you payment
    // if you use more, you pay for it
    ComputeCapacity.prototype.challenge = function () {
        var out = "";
        out += this.cpu || "";
        out += this.memory || "";
        return out;
    };
    return ComputeCapacity;
}());
exports.ComputeCapacity = ComputeCapacity;
