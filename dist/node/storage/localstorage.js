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
exports.LocalStorage = void 0;
const utils_1 = require("./utils");
class LocalStorage {
    async set(key, value) {
        if (!value || value === '""') {
            return await this.remove(key);
        }
        return localStorage.setItem(key, value);
    }
    async get(key) {
        const value = localStorage.getItem(key);
        if (value === null) {
            return '""';
        }
        return value;
    }
    async remove(key) {
        return localStorage.removeItem(key);
    }
    async list(key) {
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
    }
}
__decorate([
    utils_1.crop,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], LocalStorage.prototype, "set", null);
__decorate([
    utils_1.crop,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LocalStorage.prototype, "get", null);
__decorate([
    utils_1.crop,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LocalStorage.prototype, "remove", null);
__decorate([
    utils_1.crop,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LocalStorage.prototype, "list", null);
exports.LocalStorage = LocalStorage;
