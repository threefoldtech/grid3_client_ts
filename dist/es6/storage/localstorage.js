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
import { crop } from "./utils";
class LocalStorage {
    set(key, value) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!value || value === '""') {
                return yield this.remove(key);
            }
            return localStorage.setItem(key, value);
        });
    }
    get(key) {
        return __awaiter(this, void 0, void 0, function* () {
            const value = localStorage.getItem(key);
            if (value === null) {
                return '""';
            }
            return value;
        });
    }
    remove(key) {
        return __awaiter(this, void 0, void 0, function* () {
            return localStorage.removeItem(key);
        });
    }
    list(key) {
        return __awaiter(this, void 0, void 0, function* () {
            const keys = [];
            for (let i = 0; i < localStorage.length; i++) {
                keys.push(localStorage.key(i));
            }
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
}
__decorate([
    crop,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], LocalStorage.prototype, "set", null);
__decorate([
    crop,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LocalStorage.prototype, "get", null);
__decorate([
    crop,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LocalStorage.prototype, "remove", null);
__decorate([
    crop,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LocalStorage.prototype, "list", null);
export { LocalStorage };
