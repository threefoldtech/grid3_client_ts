declare class Twins {
    client: any;
    constructor(client: any);
    create(ip: any, callback: any): Promise<any>;
    get(id: any): Promise<any>;
    list(): Promise<any>;
    delete(id: any, callback: any): Promise<any>;
    createTwinEntity(twinID: any, entityID: any, signature: any, callback: any): Promise<any>;
    deleteTwinEntity(twinID: any, entityID: any, callback: any): Promise<any>;
}
export { Twins };
