import { TFClient } from "./client";
declare class Contracts {
    tfclient: TFClient;
    constructor(client: TFClient);
    createNode(nodeID: number, hash: string, data: string, publicIPs: number): Promise<any>;
    createName(name: string): Promise<any>;
    createRentContract(nodeId: number): Promise<any>;
    activeRentContractForNode(nodeId: number): Promise<any>;
    updateNode(id: number, data: string, hash: string): Promise<any>;
    cancel(id: number): Promise<any>;
    get(id: number): Promise<any>;
    getContractIdByNodeIdAndHash(nodeId: number, hash: string): Promise<any>;
    getNameContract(name: string): Promise<any>;
    listContractsByTwinId(graphqlURL: any, twinId: any): Promise<unknown>;
    /**
     * Get contract consumption per hour in TFT.
     *
     * @param  {number} id
     * @param  {string} graphqlURL
     * @returns {Promise<number>}
     */
    getConsumption(id: number, graphqlURL: string): Promise<number>;
    listContractsByAddress(graphqlURL: any, address: any): Promise<unknown>;
    listMyContracts(graphqlURL: any): Promise<unknown>;
    /**
     * WARNING: Please be careful when executing this method, it will delete all your contracts.
     * @param  {string} graphqlURL
     * @returns Promise
     */
    cancelMyContracts(graphqlURL: string): Promise<Record<string, number>[]>;
}
export { Contracts };
//# sourceMappingURL=contracts.d.ts.map