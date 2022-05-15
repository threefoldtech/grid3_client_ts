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
import { Nodes } from "../primitives/nodes";
import { FarmHasFreePublicIPsModel, FarmIdFromFarmNameModel, FarmsGetModel, FilterOptions, NodeFreeResourcesModel, NodesByFarmIdModel, NodesGetModel, } from "./models";
class Capacity {
    constructor(config) {
        this.nodes = new Nodes(config.graphqlURL, config.rmbClient["proxyURL"]);
    }
    getFarms(options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.nodes.getFarms(options.page, options.maxResult);
        });
    }
    getNodes(options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.nodes.getNodes(options.page, options.maxResult);
        });
    }
    getAllFarms() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.nodes.getAllFarms();
        });
    }
    getAllNodes() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.nodes.getAllNodes();
        });
    }
    filterNodes(options) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.nodes.filterNodes(options);
        });
    }
    checkFarmHasFreePublicIps(options) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.nodes.checkFarmHasFreePublicIps(options.farmId);
        });
    }
    getNodesByFarmId(options) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.nodes.getNodesByFarmId(options.farmId);
        });
    }
    getNodeFreeResources(options) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.nodes.getNodeFreeResources(options.nodeId);
        });
    }
    getFarmIdFromFarmName(options) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.nodes.getFarmIdFromFarmName(options.farmName);
        });
    }
}
__decorate([
    expose,
    validateInput,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [FarmsGetModel]),
    __metadata("design:returntype", Promise)
], Capacity.prototype, "getFarms", null);
__decorate([
    expose,
    validateInput,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [NodesGetModel]),
    __metadata("design:returntype", Promise)
], Capacity.prototype, "getNodes", null);
__decorate([
    expose,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], Capacity.prototype, "getAllFarms", null);
__decorate([
    expose,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], Capacity.prototype, "getAllNodes", null);
__decorate([
    expose,
    validateInput,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [FilterOptions]),
    __metadata("design:returntype", Promise)
], Capacity.prototype, "filterNodes", null);
__decorate([
    expose,
    validateInput,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [FarmHasFreePublicIPsModel]),
    __metadata("design:returntype", Promise)
], Capacity.prototype, "checkFarmHasFreePublicIps", null);
__decorate([
    expose,
    validateInput,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [NodesByFarmIdModel]),
    __metadata("design:returntype", Promise)
], Capacity.prototype, "getNodesByFarmId", null);
__decorate([
    expose,
    validateInput,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [NodeFreeResourcesModel]),
    __metadata("design:returntype", Promise)
], Capacity.prototype, "getNodeFreeResources", null);
__decorate([
    expose,
    validateInput,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [FarmIdFromFarmNameModel]),
    __metadata("design:returntype", Promise)
], Capacity.prototype, "getFarmIdFromFarmName", null);
export { Capacity as capacity };
