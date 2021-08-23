import { Contracts } from './contracts';
import { Twins } from "./twins";
declare class TFClient {
    client: any;
    contracts: Contracts;
    twins: Twins;
    constructor(url: any, mnemonic: any);
    connect(): Promise<void>;
    disconnect(): void;
    applyExtrinsic(func: any, args: any, resultSecttion: any, resultName: any): Promise<unknown>;
}
export { TFClient };
