declare class TFClient {
    client: any;
    contracts: any;
    constructor(url: any, mnemonic: any);
    connect(): Promise<void>;
    disconnect(): void;
}
export { TFClient };
