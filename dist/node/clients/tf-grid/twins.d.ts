import { TFClient } from "./client";
declare class Twins {
    tfclient: TFClient;
    constructor(client: TFClient);
    create(ip: string): Promise<any>;
    get(id: number): Promise<any>;
    getMyTwinId(): Promise<number>;
    getTwinIdByAccountId(publicKey: string): Promise<number>;
    list(): Promise<any>;
    delete(id: number): Promise<any>;
}
export { Twins };
//# sourceMappingURL=twins.d.ts.map