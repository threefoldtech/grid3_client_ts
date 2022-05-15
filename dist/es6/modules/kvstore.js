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
import { TFClient } from "../clients/tf-grid/client";
import { expose } from "../helpers/expose";
import { validateInput } from "../helpers/validator";
import { KVStoreGetModel, KVStoreRemoveModel, KVStoreSetModel } from "./models";
import { checkBalance } from "./utils";
class KVStore {
    constructor(config) {
        this.client = new TFClient(config.substrateURL, config.mnemonic, config.storeSecret, config.keypairType);
    }
    set(options) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.client.kvStore.set(options.key, options.value);
        });
    }
    get(options) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.client.kvStore.get(options.key);
        });
    }
    list() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.client.kvStore.list();
        });
    }
    remove(options) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.client.kvStore.remove(options.key);
        });
    }
    removeAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.client.kvStore.removeAll();
        });
    }
}
__decorate([
    expose,
    validateInput,
    checkBalance,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [KVStoreSetModel]),
    __metadata("design:returntype", Promise)
], KVStore.prototype, "set", null);
__decorate([
    expose,
    validateInput,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [KVStoreGetModel]),
    __metadata("design:returntype", Promise)
], KVStore.prototype, "get", null);
__decorate([
    expose,
    validateInput,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], KVStore.prototype, "list", null);
__decorate([
    expose,
    validateInput,
    checkBalance,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [KVStoreRemoveModel]),
    __metadata("design:returntype", Promise)
], KVStore.prototype, "remove", null);
__decorate([
    expose,
    validateInput,
    checkBalance,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], KVStore.prototype, "removeAll", null);
export { KVStore as kvstore };
