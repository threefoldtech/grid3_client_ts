"use strict";
exports.__esModule = true;
exports.WorkloadTypes = exports.Workload = void 0;
var ResultStates;
(function (ResultStates) {
    ResultStates["error"] = "error";
    ResultStates["ok"] = "ok";
    ResultStates["deleted"] = "deleted";
})(ResultStates || (ResultStates = {}));
var WorkloadTypes;
(function (WorkloadTypes) {
    WorkloadTypes["zmachine"] = "zmachine";
    WorkloadTypes["zmount"] = "zmount";
    WorkloadTypes["network"] = "network";
    WorkloadTypes["zdb"] = "zdb";
    WorkloadTypes["ipv4"] = "ipv4";
})(WorkloadTypes || (WorkloadTypes = {}));
exports.WorkloadTypes = WorkloadTypes;
var Right;
(function (Right) {
    Right[Right["restart"] = 0] = "restart";
    Right[Right["delete"] = 1] = "delete";
    Right[Right["stats"] = 2] = "stats";
    Right[Right["logs"] = 3] = "logs";
})(Right || (Right = {}));
// Access Control Entry
var ACE = /** @class */ (function () {
    function ACE() {
    }
    return ACE;
}());
var DeploymentResult = /** @class */ (function () {
    function DeploymentResult() {
        this.error = "";
        this.data = ""; // also json.RawMessage
    }
    return DeploymentResult;
}());
var Workload = /** @class */ (function () {
    function Workload() {
    }
    Workload.prototype.challenge = function () {
        var out = "";
        out += this.version;
        out += this.type.toString();
        out += this.metadata;
        out += this.description;
        out += this.data.challenge();
        return out;
    };
    return Workload;
}());
exports.Workload = Workload;
