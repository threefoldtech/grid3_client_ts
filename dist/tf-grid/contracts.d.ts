declare class Contracts {
    client: any;
    constructor(client: any);
    create(nodeID: any, hash: any, data: any, publicIPs: any, callback: any): Promise<any>;
    update(id: any, data: any, hash: any): Promise<any>;
    cancel(id: any): Promise<any>;
    get(id: any): Promise<void>;
}
export { Contracts };
