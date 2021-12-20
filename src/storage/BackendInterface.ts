interface BackendInterface {
    get(key: string): Promise<string>;
    set(key: string, value: string): Promise<any>;
    remove(key: string): Promise<any>;
    list(key: string): Promise<string[]>;
}

export default BackendInterface;
