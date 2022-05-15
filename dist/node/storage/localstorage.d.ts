declare class LocalStorage {
    set(key: string, value: string): Promise<void>;
    get(key: string): Promise<string>;
    remove(key: string): Promise<void>;
    list(key: string): Promise<unknown[]>;
}
export { LocalStorage };
//# sourceMappingURL=localstorage.d.ts.map