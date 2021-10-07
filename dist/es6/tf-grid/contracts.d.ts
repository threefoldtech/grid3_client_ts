declare class Contracts {
    tfclient: any;
    constructor(client: any);
    createNode(nodeID: any, hash: any, data: any, publicIPs: any): Promise<any>;
    createName(name: any): Promise<any>;
    updateNode(id: any, data: any, hash: any): Promise<any>;
    cancel(id: any): Promise<any>;
    get(id: any): Promise<any>;
}
export { Contracts };
//# sourceMappingURL=contracts.d.ts.map