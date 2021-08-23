import { Contracts } from './contracts';
import { Twins } from "./twins";
declare class TFClient {
    client: any;
    contracts: Contracts;
    twins: Twins;
    constructor(url: any, mnemonic: any);
    connect(): Promise<void>;
    disconnect(): void;
}
export { TFClient };
