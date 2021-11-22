import { crop } from "./utils";

class LocalStorage {
    @crop
    async set(key: string, value: string) {
        if (!value || value === '""') {
            return await this.remove(key);
        }
        return localStorage.setItem(key, value);
    }

    @crop
    async get(key: string) {
        const value = localStorage.getItem(key);
        if (value === null) {
            return '""';
        }
        return value;
    }

    @crop
    async remove(key: string) {
        return localStorage.removeItem(key);
    }

    @crop
    async list(key: string) {
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

export { LocalStorage };
