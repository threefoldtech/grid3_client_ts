declare class Twins {
    tfclient: any;
    constructor(client: any);
    create(ip: string): Promise<any>;
    get(id: number): Promise<any>;
    list(): Promise<any>;
    delete(id: number): Promise<any>;
}
export { Twins };
//# sourceMappingURL=twins.d.ts.map