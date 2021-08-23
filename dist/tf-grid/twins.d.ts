declare class Twins {
    tfclient: any;
    constructor(client: any);
    create(ip: any): Promise<any>;
    get(id: any): Promise<any>;
    list(): Promise<any>;
    delete(id: any): Promise<any>;
}
export { Twins };
