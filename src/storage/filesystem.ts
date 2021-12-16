import fs from "fs";
import PATH from "path";
import BackendInterface from "./BackendInterface";

class FS implements BackendInterface {
    async set(key: string, value: string) {
        if (value && value !== '""' && !fs.existsSync(PATH.dirname(key))) {
            fs.mkdirSync(PATH.dirname(key), { recursive: true });
        }
        if (!value || value === '""') {
            return await this.remove(key);
        }
        return fs.writeFileSync(key, value);
    }

    async get(key: string) {
        if (!fs.existsSync(key)) {
            return '""';
        }
        return fs.readFileSync(key);
    }

    async remove(key: string) {
        if (!fs.existsSync(key)) {
            return;
        }
        fs.unlinkSync(key);
        while (fs.readdirSync(PATH.dirname(key)).length === 0) {
            key = PATH.dirname(key);
            fs.rmdirSync(key);
        }
    }

    async list(key: string) {
        if (!fs.existsSync(key)) {
            return [];
        }
        return fs.readdirSync(key);
    }
}

export { FS };
