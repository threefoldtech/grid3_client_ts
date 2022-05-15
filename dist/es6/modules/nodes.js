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
import { TFClient } from "../clients";
import { events, validateInput } from "../helpers";
import { expose } from "../helpers/expose";
import { RentContractCreateModel, RentContractDeleteModel, RentContractGetModel } from "./models";
import { checkBalance } from "./utils";
class Nodes {
    constructor(config) {
        this.config = config;
        this.client = new TFClient(config.substrateURL, config.mnemonic, config.storeSecret, config.keypairType);
    }
    reserve(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const rentContract = yield this.getRent({ nodeId: options.nodeId });
            if (rentContract.contract_id != 0) {
                throw Error(`Node Already rented by user with twinId ${rentContract.twin_id}`);
            }
            try {
                const res = yield this.client.contracts.createRentContract(options.nodeId);
                events.emit("logs", `Rent contract with id: ${res["contract_id"]} has been created`);
                return res;
            }
            catch (e) {
                throw Error(`Failed to create rent contract on node ${options.nodeId} due to ${e}`);
            }
        });
    }
    unreserve(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const rentContract = yield this.getRent({ nodeId: options.nodeId });
            if (rentContract.contract_id === 0) {
                events.emit("logs", `No rent contract found for node ${options.nodeId}`);
                return rentContract;
            }
            try {
                const res = yield this.client.contracts.cancel(rentContract.contract_id);
                events.emit("logs", `Rent contract for node ${options.nodeId} has been deleted`);
                return res;
            }
            catch (e) {
                throw Error(`Failed to delete rent contract on node ${options.nodeId} due to ${e}`);
            }
        });
    }
    getRent(options) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.client.contracts.activeRentContractForNode(options.nodeId);
        });
    }
}
__decorate([
    expose,
    validateInput,
    checkBalance,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [RentContractCreateModel]),
    __metadata("design:returntype", Promise)
], Nodes.prototype, "reserve", null);
__decorate([
    expose,
    validateInput,
    checkBalance,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [RentContractDeleteModel]),
    __metadata("design:returntype", Promise)
], Nodes.prototype, "unreserve", null);
__decorate([
    expose,
    validateInput,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [RentContractGetModel]),
    __metadata("design:returntype", Promise)
], Nodes.prototype, "getRent", null);
export { Nodes as nodes };
