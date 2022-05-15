var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import fs from "fs";
import PATH from "path";
class FS {
    set(key, value) {
        return __awaiter(this, void 0, void 0, function* () {
            if (value && value !== '""' && !fs.existsSync(PATH.dirname(key))) {
                fs.mkdirSync(PATH.dirname(key), { recursive: true });
            }
            if (!value || value === '""') {
                return yield this.remove(key);
            }
            return fs.writeFileSync(key, value);
        });
    }
    get(key) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!fs.existsSync(key)) {
                return '""';
            }
            return fs.readFileSync(key);
        });
    }
    remove(key) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!fs.existsSync(key)) {
                return;
            }
            fs.unlinkSync(key);
            while (fs.readdirSync(PATH.dirname(key)).length === 0) {
                key = PATH.dirname(key);
                fs.rmdirSync(key);
            }
        });
    }
    list(key) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!fs.existsSync(key)) {
                return [];
            }
            return fs.readdirSync(key);
        });
    }
}
export { FS };
