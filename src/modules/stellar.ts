import * as PATH from "path";

import { default as StellarSdk } from "stellar-sdk";
import { MessageBusClientInterface } from "ts-rmb-client-base";

import {
    WalletImportModel,
    WalletBalanceByNameModel,
    WalletBalanceByAddressModel,
    WalletTransferModel,
    WalletGetModel,
    WalletDeleteModel,
} from ".";
import { expose } from "../helpers/expose";
import { appPath, BackendStorage, BackendStorageType, StorageUpdateAction } from "../storage/backend";

const server = new StellarSdk.Server("https://horizon.stellar.org");

class Stellar {
    fileName = "stellar.json";
    backendStorage: BackendStorage;

    constructor(
        public twin_id: number,
        public url: string,
        public mnemonic: string,
        public rmbClient: MessageBusClientInterface,
        public storePath: string,
        public projectName: string = "",
        public backendStorageType: BackendStorageType = BackendStorageType.default,
    ) {
        this.backendStorage = new BackendStorage(backendStorageType);
    }

    async _load() {
        const path = PATH.join(appPath, this.fileName);
        const data = await this.backendStorage.load(path);
        return [path, data];
    }

    async save(name: string, secret: string) {
        const [path, data] = await this._load();
        if (data[name]) {
            throw Error(`A wallet with the same name ${name} already exists`);
        }
        await this.backendStorage.update(path, name, secret);
    }

    async getWalletSecret(name: string) {
        const [_, data] = await this._load();
        return data[name];
    }

    @expose
    async import(options: WalletImportModel) {
        const walletKeypair = StellarSdk.Keypair.fromSecret(options.secret);
        const walletPublicKey = walletKeypair.publicKey();
        await server.loadAccount(walletPublicKey);
        await this.save(options.name, options.secret);
        return walletPublicKey;
    }

    @expose
    async get(options: WalletGetModel) {
        const secret = await this.getWalletSecret(options.name);
        const walletKeypair = StellarSdk.Keypair.fromSecret(secret);
        return walletKeypair.publicKey(); // TODO: return wallet secret after adding security context on the server calls
    }

    @expose
    async update(options: WalletImportModel) {
        if (!(await this.exist(options))) {
            throw Error(`Couldn't find a wallet with name ${options.name} to update`);
        }
        const secret = await this.getWalletSecret(options.name);
        const deleteWallet = new WalletDeleteModel();
        deleteWallet.name = options.name;
        await this.delete(deleteWallet);
        try {
            return await this.import(options);
        } catch (e) {
            const oldSecret = options.secret;
            options.secret = secret;
            await this.import(options);
            throw Error(`Couldn't import wallet with secret ${oldSecret} due to: ${e}`);
        }
    }

    @expose
    async exist(options: WalletGetModel) {
        return (await this.list()).includes(options.name);
    }

    @expose
    async list() {
        const [_, data] = await this._load();
        return Object.keys(data);
    }

    @expose
    async balance_by_name(options: WalletBalanceByNameModel) {
        const secret = await this.getWalletSecret(options.name);
        if (!secret) {
            throw Error(`could not find a wallet with name ${options.name}`);
        }
        const walletKeypair = StellarSdk.Keypair.fromSecret(secret);
        const walletPublicKey = walletKeypair.publicKey();
        const walletAddress = new WalletBalanceByAddressModel();
        walletAddress.address = walletPublicKey;
        return await this.balance_by_address(walletAddress);
    }

    @expose
    async balance_by_address(options: WalletBalanceByAddressModel) {
        const account = await server.loadAccount(options.address);
        const balances = [];
        for (const balance of account.balances) {
            if (!balance.asset_code) {
                balance.asset_code = "XLM";
            }
            balances.push({ asset: balance.asset_code, amount: balance.balance });
        }
        return balances;
    }

    @expose
    async transfer(options: WalletTransferModel) {
        const secret = await this.getWalletSecret(options.name);
        if (!secret) {
            throw Error(`could not find a wallet with name ${options.name}`);
        }
        const sourceKeypair = StellarSdk.Keypair.fromSecret(secret);
        const sourcePublicKey = sourceKeypair.publicKey();
        const sourceAccount = await server.loadAccount(sourcePublicKey);

        let issuer;
        for (const balance of sourceAccount.balances) {
            if (balance.asset_code === options.asset) {
                issuer = balance.asset_issuer;
            }
        }
        if (!issuer) {
            throw Error(`couldn't find this asset ${options.asset} on source wallet`);
        }
        const asset = new StellarSdk.Asset(options.asset, issuer);
        const fee = await server.fetchBaseFee();
        const memo = StellarSdk.Memo.text(options.memo);
        const transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
            fee: fee,
            networkPassphrase: StellarSdk.Networks.PUBLIC,
            memo: memo,
        })
            .addOperation(
                StellarSdk.Operation.payment({
                    destination: options.target_address,
                    asset: asset,
                    amount: options.amount.toString(),
                }),
            )
            .setTimeout(30)
            .build();

        transaction.sign(sourceKeypair);
        console.log(transaction.toEnvelope().toXDR("base64"));
        try {
            const transactionResult = await server.submitTransaction(transaction);
            console.log(JSON.stringify(transactionResult, null, 2));
            console.log("Success! View the transaction at: ", transactionResult._links.transaction.href);
            return transactionResult._links.transaction.href;
        } catch (e) {
            console.log("An error has occured:", e);
            throw Error(e);
        }
    }

    @expose
    async delete(options: WalletDeleteModel) {
        const [path, data] = await this._load();
        if (!data[options.name]) {
            throw Error(`Couldn't find a wallet with name ${options.name}`);
        }
        await this.backendStorage.update(path, options.name, "", StorageUpdateAction.delete);
        return "Deleted";
    }
}

export { Stellar as stellar };
