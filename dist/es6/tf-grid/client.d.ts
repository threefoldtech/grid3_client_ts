import { Contracts } from "./contracts";
import { Twins } from "./twins";
declare class TFClient {
    client: any;
    contracts: Contracts;
    twins: Twins;
    constructor(url: string, mnemonic: string);
    connect(): Promise<void>;
    disconnect(): void;
    applyExtrinsic(func: any, args: any, resultSecttion: string, resultName: string): Promise<unknown>;
}
export { TFClient };
//# sourceMappingURL=client.d.ts.map