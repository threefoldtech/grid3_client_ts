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
import { crop } from "./utils";
const SPLIT_SIZE = 1490;
class TFKVStore {
    constructor(url, mnemonic, storeSecret, keypairType) {
        this.client = new TFClient(url, mnemonic, storeSecret, keypairType);
    }
    set(key, value) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!value || value === '""') {
                return yield this.remove(key);
            }
            const splits = this.split(key, value);
            for (const k of Object.keys(splits)) {
                yield this.client.kvStore.set(k, splits[k]);
            }
        });
    }
    get(key) {
        return __awaiter(this, void 0, void 0, function* () {
            let value = yield this.client.kvStore.get(key);
            if (!value) {
                return '""';
            }
            let i = 0;
            let val = value;
            while (val) {
                i++;
                key = `${key}.${i}`;
                val = yield this.client.kvStore.get(key);
                value = `${value}${val}`;
            }
            return value;
        });
    }
    remove(key) {
        return __awaiter(this, void 0, void 0, function* () {
            const value = yield this.client.kvStore.get(key);
            if (!value) {
                return;
            }
            return yield this.client.kvStore.remove(key);
        });
    }
    list(key) {
        return __awaiter(this, void 0, void 0, function* () {
            const keys = yield this.client.kvStore.list();
            const filteredKeys = new Set();
            for (const k of keys) {
                if (!k.startsWith(key)) {
                    continue;
                }
                const splits = k.split(key)[1].split("/");
                const split = splits[0] === "" ? splits[1] : splits[0];
                filteredKeys.add(split);
            }
            return [...filteredKeys];
        });
    }
    split(key, value) {
        const splits = {};
        let i = 0;
        let k = key;
        while (value.length > SPLIT_SIZE) {
            const val = value.slice(0, SPLIT_SIZE);
            splits[k] = val;
            i++;
            k = `${key}.${i}`;
            value = value.slice(SPLIT_SIZE);
        }
        splits[k] = value;
        return splits;
    }
}
__decorate([
    crop,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], TFKVStore.prototype, "set", null);
__decorate([
    crop,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TFKVStore.prototype, "get", null);
__decorate([
    crop,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TFKVStore.prototype, "remove", null);
__decorate([
    crop,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TFKVStore.prototype, "list", null);
export { TFKVStore };
