import { TFClient } from "./client";
declare class Balance {
    tfclient: TFClient;
    constructor(client: TFClient);
    get(address: string): Promise<Record<string, number>>;
    getMyBalance(): Promise<Record<string, number>>;
    transfer(address: string, amount: number): Promise<number>;
}
export { Balance };
//# sourceMappingURL=balance.d.ts.map