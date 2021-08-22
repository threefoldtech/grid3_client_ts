declare class Contracts {
    client: any;
    constructor(client: any);
    createContract(nodeID: any, hash: any, data: any, publicIPs: any, callback: any): Promise<any>;
    updateContract(id: any, data: any, hash: any): Promise<any>;
    cancelContract(id: any): Promise<any>;
    getContract(id: any): Promise<void>;
}
export { Contracts };
