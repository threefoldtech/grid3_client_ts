"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Operations = exports.TwinDeployment = void 0;
var Operations;
(function (Operations) {
    Operations["deploy"] = "deploy";
    Operations["update"] = "update";
    Operations["delete"] = "delete";
})(Operations || (Operations = {}));
exports.Operations = Operations;
class TwinDeployment {
    deployment;
    operation;
    publicIps;
    nodeId;
    network;
    constructor(deployment, operation, publicIps, nodeId, network = null) {
        this.deployment = deployment;
        this.operation = operation;
        this.publicIps = publicIps;
        this.nodeId = nodeId;
        this.network = network;
    }
}
exports.TwinDeployment = TwinDeployment;
