import { GridClientConfig } from "../config";
import { BackendStorage } from "../storage/backend";
import { WalletBalanceByAddressModel, WalletBalanceByNameModel, WalletDeleteModel, WalletGetModel, WalletImportModel, WalletTransferModel } from ".";
declare class Stellar {
    fileName: string;
    backendStorage: BackendStorage;
    constructor(config: GridClientConfig);
    _load(): Promise<any[]>;
    save(name: string, secret: string): Promise<void>;
    getWalletSecret(name: string): Promise<any>;
    import(options: WalletImportModel): Promise<any>;
    get(options: WalletGetModel): Promise<any>;
    update(options: WalletImportModel): Promise<any>;
    exist(options: WalletGetModel): Promise<boolean>;
    list(): Promise<string[]>;
    balance_by_name(options: WalletBalanceByNameModel): Promise<any[]>;
    balance_by_address(options: WalletBalanceByAddressModel): Promise<any[]>;
    transfer(options: WalletTransferModel): Promise<any>;
    delete(options: WalletDeleteModel): Promise<string>;
}
export { Stellar as stellar };
//# sourceMappingURL=stellar.d.ts.map