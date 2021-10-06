var Operations;
(function (Operations) {
    Operations["deploy"] = "deploy";
    Operations["update"] = "update";
    Operations["delete"] = "delete";
})(Operations || (Operations = {}));
class TwinDeployment {
    constructor(deployment, operation, publicIps, nodeId, network = null) {
        this.deployment = deployment;
        this.operation = operation;
        this.publicIps = publicIps;
        this.nodeId = nodeId;
        this.network = network;
    }
}
export { TwinDeployment, Operations };
