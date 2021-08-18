"use strict";
// ssd mounts under zmachine
exports.__esModule = true;
exports.ZmountResult = exports.Zmount = void 0;
// ONLY possible on SSD
var Zmount = /** @class */ (function () {
    function Zmount() {
    }
    Zmount.prototype.challenge = function () {
        return this.size || "";
    };
    return Zmount;
}());
exports.Zmount = Zmount;
var ZmountResult = /** @class */ (function () {
    function ZmountResult() {
    }
    return ZmountResult;
}());
exports.ZmountResult = ZmountResult;
