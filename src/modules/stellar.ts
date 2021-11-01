import * as PATH from "path";

import { default as StellarSdk } from "stellar-sdk";

import {
    WalletImportModel,
    WalletBalanceByNameModel,
    WalletBalanceByAddressModel,
    WalletTransferModel,
    WalletGetModel,
    WalletDeleteModel,
} from ".";
import { expose } from "../helpers/expose";
import { loadFromFile, updatejson, appPath } from "../helpers/jsonfs";

const server = new StellarSdk.Server("https://horizon.stellar.org");

class Stellar {
    fileName = "stellar.json";

    save(name: string, secret: string) {
        const path = PATH.join(appPath, this.fileName);
        const data = loadFromFile(path);
        if (data[name]) {
            throw Error(`A wallet with the same name ${name} already exists`);
        }
        updatejson(path, name, secret);
    }

    getWalletSecret(name: string) {
        const path = PATH.join(appPath, this.fileName);
        const data = loadFromFile(path);
        return data[name];
    }

    @expose
    async import(options: WalletImportModel) {
        const walletKeypair = StellarSdk.Keypair.fromSecret(options.secret);
        const walletPublicKey = walletKeypair.publicKey();
        await server.loadAccount(walletPublicKey);
        this.save(options.name, options.secret);
        return walletPublicKey;
    }

    @expose
    get(options: WalletGetModel) {
        const secret = this.getWalletSecret(options.name);
        const walletKeypair = StellarSdk.Keypair.fromSecret(secret);
        return walletKeypair.publicKey(); // TODO: return wallet secret after adding security context on the server calls
    }

    @expose
    async update(options: WalletImportModel) {
        if (!this.exist(options)) {
            throw Error(`Couldn't find a wallet with name ${options.name} to update`);
        }
        const secret = this.getWalletSecret(options.name);
        const deleteWallet = new WalletDeleteModel();
        deleteWallet.name = options.name;
        this.delete(deleteWallet);
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
    exist(options: WalletGetModel) {
        return this.list().includes(options.name);
    }

    @expose
    list() {
        const path = PATH.join(appPath, this.fileName);
        const data = loadFromFile(path);
        return Object.keys(data);
    }

    @expose
    async balance_by_name(options: WalletBalanceByNameModel) {
        const secret = this.getWalletSecret(options.name);
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
        const secret = this.getWalletSecret(options.name);
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
    delete(options: WalletDeleteModel) {
        const path = PATH.join(appPath, this.fileName);
        const data = loadFromFile(path);
        if (!data[options.name]) {
            throw Error(`Couldn't find a wallet with name ${options.name}`);
        }
        updatejson(path, options.name, "", "delete");
        return "Deleted";
    }
}

export { Stellar as stellar };
