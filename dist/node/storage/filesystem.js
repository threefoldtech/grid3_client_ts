"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FS = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
class FS {
    async set(key, value) {
        if (value && value !== '""' && !fs_1.default.existsSync(path_1.default.dirname(key))) {
            fs_1.default.mkdirSync(path_1.default.dirname(key), { recursive: true });
        }
        if (!value || value === '""') {
            return await this.remove(key);
        }
        return fs_1.default.writeFileSync(key, value);
    }
    async get(key) {
        if (!fs_1.default.existsSync(key)) {
            return '""';
        }
        return fs_1.default.readFileSync(key);
    }
    async remove(key) {
        if (!fs_1.default.existsSync(key)) {
            return;
        }
        fs_1.default.unlinkSync(key);
        while (fs_1.default.readdirSync(path_1.default.dirname(key)).length === 0) {
            key = path_1.default.dirname(key);
            fs_1.default.rmdirSync(key);
        }
    }
    async list(key) {
        if (!fs_1.default.existsSync(key)) {
            return [];
        }
        return fs_1.default.readdirSync(key);
    }
}
exports.FS = FS;
