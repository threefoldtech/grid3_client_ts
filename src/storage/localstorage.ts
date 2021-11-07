import { crop } from "./utils";

class LocalStorage {

    @crop
    async set(key: string, value: string) {
        if (!value || value === "{}") {
            return await this.remove(key);
        }
        return localStorage.setItem(key, value);
    }

    @crop
    async get(key: string) {
        const value = localStorage.getItem(key);
        if (value === null) {
            return "{}";
        }
        return value;
    }

    @crop
    async remove(key: string) {
        return localStorage.removeItem(key);
    }
}

export { LocalStorage };
