declare class Twins {
    client: any;
    constructor(client: any);
    createTwin(ip: any, callback: any): Promise<any>;
    getTwin(id: any): Promise<any>;
    listTwins(): Promise<any>;
    deleteTwin(id: any, callback: any): Promise<any>;
    createTwinEntity(twinID: any, entityID: any, signature: any, callback: any): Promise<any>;
    deleteTwinEntity(twinID: any, entityID: any, callback: any): Promise<any>;
}
export { Twins };
