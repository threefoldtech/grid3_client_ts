var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { expose } from "../helpers/expose";
import { validateInput } from "../helpers/validator";
import { Operations, TwinDeployment } from "../high_level/models";
import { TwinDeploymentHandler } from "../high_level/twinDeploymentHandler";
import { DeploymentFactory } from "../primitives/deployment";
import { WorkloadTypes } from "../zos/workload";
import { ZOSModel } from "./models";
import { checkBalance } from "./utils";
class Zos {
    constructor(config) {
        this.config = config;
    }
    deploy(options) {
        return __awaiter(this, void 0, void 0, function* () {
            // get node_id from the deployment
            const node_id = options.node_id;
            delete options.node_id;
            const deploymentFactory = new DeploymentFactory(this.config);
            const deployment = yield deploymentFactory.fromObj(options);
            let publicIps = 0;
            for (const workload of deployment.workloads) {
                if (workload.type === WorkloadTypes.ip && workload.data["v4"]) {
                    publicIps++;
                }
            }
            console.log(`Deploying on node_id: ${node_id} with number of public IPs: ${publicIps}`);
            const twinDeployment = new TwinDeployment(deployment, Operations.deploy, publicIps, node_id);
            const twinDeploymentHandler = new TwinDeploymentHandler(this.config);
            return yield twinDeploymentHandler.handle([twinDeployment]);
        });
    }
}
__decorate([
    expose,
    validateInput,
    checkBalance,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ZOSModel]),
    __metadata("design:returntype", Promise)
], Zos.prototype, "deploy", null);
export { Zos as zos };
