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
exports.TFKVStore = void 0;
const client_1 = require("../clients/tf-grid/client");
const utils_1 = require("./utils");
const SPLIT_SIZE = 1490;
class TFKVStore {
    client;
    constructor(url, mnemonic, storeSecret, keypairType) {
        this.client = new client_1.TFClient(url, mnemonic, storeSecret, keypairType);
    }
    async set(key, value) {
        if (!value || value === '""') {
            return await this.remove(key);
        }
        const splits = this.split(key, value);
        for (const k of Object.keys(splits)) {
            await this.client.kvStore.set(k, splits[k]);
        }
    }
    async get(key) {
        let value = await this.client.kvStore.get(key);
        if (!value) {
            return '""';
        }
        let i = 0;
        let val = value;
        while (val) {
            i++;
            key = `${key}.${i}`;
            val = await this.client.kvStore.get(key);
            value = `${value}${val}`;
        }
        return value;
    }
    async remove(key) {
        const value = await this.client.kvStore.get(key);
        if (!value) {
            return;
        }
        return await this.client.kvStore.remove(key);
    }
    async list(key) {
        const keys = await this.client.kvStore.list();
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
    utils_1.crop,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], TFKVStore.prototype, "set", null);
__decorate([
    utils_1.crop,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TFKVStore.prototype, "get", null);
__decorate([
    utils_1.crop,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TFKVStore.prototype, "remove", null);
__decorate([
    utils_1.crop,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TFKVStore.prototype, "list", null);
exports.TFKVStore = TFKVStore;
