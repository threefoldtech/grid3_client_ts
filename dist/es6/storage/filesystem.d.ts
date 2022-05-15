/// <reference types="node" />
declare class FS {
    set(key: string, value: string): Promise<void>;
    get(key: string): Promise<"\"\"" | Buffer>;
    remove(key: string): Promise<void>;
    list(key: string): Promise<string[]>;
}
export { FS };
//# sourceMappingURL=filesystem.d.ts.map