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
exports.zos = void 0;
const expose_1 = require("../helpers/expose");
const validator_1 = require("../helpers/validator");
const models_1 = require("../high_level/models");
const twinDeploymentHandler_1 = require("../high_level/twinDeploymentHandler");
const deployment_1 = require("../primitives/deployment");
const workload_1 = require("../zos/workload");
const models_2 = require("./models");
const utils_1 = require("./utils");
class Zos {
    config;
    constructor(config) {
        this.config = config;
    }
    async deploy(options) {
        // get node_id from the deployment
        const node_id = options.node_id;
        delete options.node_id;
        const deploymentFactory = new deployment_1.DeploymentFactory(this.config);
        const deployment = await deploymentFactory.fromObj(options);
        let publicIps = 0;
        for (const workload of deployment.workloads) {
            if (workload.type === workload_1.WorkloadTypes.ip && workload.data["v4"]) {
                publicIps++;
            }
        }
        console.log(`Deploying on node_id: ${node_id} with number of public IPs: ${publicIps}`);
        const twinDeployment = new models_1.TwinDeployment(deployment, models_1.Operations.deploy, publicIps, node_id);
        const twinDeploymentHandler = new twinDeploymentHandler_1.TwinDeploymentHandler(this.config);
        return await twinDeploymentHandler.handle([twinDeployment]);
    }
}
__decorate([
    expose_1.expose,
    validator_1.validateInput,
    utils_1.checkBalance,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [models_2.ZOSModel]),
    __metadata("design:returntype", Promise)
], Zos.prototype, "deploy", null);
exports.zos = Zos;
