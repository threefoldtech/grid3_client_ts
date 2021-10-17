declare class Contracts {
    tfclient: any;
    constructor(client: any);
    createNode(nodeID: number, hash: string, data: string, publicIPs: number): Promise<any>;
    createName(name: string): Promise<any>;
    updateNode(id: number, data: string, hash: string): Promise<any>;
    cancel(id: number): Promise<any>;
    get(id: number): Promise<any>;
}
export { Contracts };
//# sourceMappingURL=contracts.d.ts.map