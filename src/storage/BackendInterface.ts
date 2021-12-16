interface BackendInterface {
    get(key: string): Promise<any>;
    set(key: string, value: any): Promise<any>;
    remove(key: string): Promise<any>;
    list(key: string): Promise<any>;
}

export default BackendInterface;
