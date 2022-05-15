import { TFClient } from "../clients/tf-grid/client";
import { GridClientConfig } from "../config";
import { BalanceGetModel, BalanceTransferModel } from "./models";
declare class Balance {
    client: TFClient;
    constructor(config: GridClientConfig);
    get(options: BalanceGetModel): Promise<Record<string, number>>;
    transfer(options: BalanceTransferModel): Promise<number>;
    getMyBalance(): Promise<Record<string, number>>;
}
export { Balance as balance };
//# sourceMappingURL=balance.d.ts.map