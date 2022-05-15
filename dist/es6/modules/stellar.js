var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as PATH from "path";
import { default as StellarSdk } from "stellar-sdk";
import { expose } from "../helpers/expose";
import { validateInput } from "../helpers/validator";
import { appPath, BackendStorage, StorageUpdateAction } from "../storage/backend";
import { WalletBalanceByAddressModel, WalletBalanceByNameModel, WalletDeleteModel, WalletGetModel, WalletImportModel, WalletTransferModel, } from ".";
const server = new StellarSdk.Server("https://horizon.stellar.org");
class Stellar {
    constructor(config) {
        this.fileName = "stellar.json";
        this.backendStorage = new BackendStorage(config.backendStorageType, config.substrateURL, config.mnemonic, config.storeSecret, config.keypairType);
    }
    _load() {
        return __awaiter(this, void 0, void 0, function* () {
            const path = PATH.join(appPath, this.fileName);
            let data = yield this.backendStorage.load(path);
            if (!data) {
                data = {};
            }
            return [path, data];
        });
    }
    save(name, secret) {
        return __awaiter(this, void 0, void 0, function* () {
            const [path, data] = yield this._load();
            if (data[name]) {
                throw Error(`A wallet with the same name ${name} already exists`);
            }
            yield this.backendStorage.update(path, name, secret);
        });
    }
    getWalletSecret(name) {
        return __awaiter(this, void 0, void 0, function* () {
            const [, data] = yield this._load();
            return data[name];
        });
    }
    import(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const walletKeypair = StellarSdk.Keypair.fromSecret(options.secret);
            const walletPublicKey = walletKeypair.publicKey();
            yield server.loadAccount(walletPublicKey);
            yield this.save(options.name, options.secret);
            return walletPublicKey;
        });
    }
    get(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const secret = yield this.getWalletSecret(options.name);
            const walletKeypair = StellarSdk.Keypair.fromSecret(secret);
            return walletKeypair.publicKey(); // TODO: return wallet secret after adding security context on the server calls
        });
    }
    update(options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(yield this.exist(options))) {
                throw Error(`Couldn't find a wallet with name ${options.name} to update`);
            }
            const secret = yield this.getWalletSecret(options.name);
            const deleteWallet = new WalletDeleteModel();
            deleteWallet.name = options.name;
            yield this.delete(deleteWallet);
            try {
                return yield this.import(options);
            }
            catch (e) {
                const oldSecret = options.secret;
                options.secret = secret;
                yield this.import(options);
                throw Error(`Couldn't import wallet with the secret ${oldSecret} due to: ${e}`);
            }
        });
    }
    exist(options) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.list()).includes(options.name);
        });
    }
    list() {
        return __awaiter(this, void 0, void 0, function* () {
            const [, data] = yield this._load();
            return Object.keys(data);
        });
    }
    balance_by_name(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const secret = yield this.getWalletSecret(options.name);
            if (!secret) {
                throw Error(`Couldn't find a wallet with name ${options.name}`);
            }
            const walletKeypair = StellarSdk.Keypair.fromSecret(secret);
            const walletPublicKey = walletKeypair.publicKey();
            const walletAddress = new WalletBalanceByAddressModel();
            walletAddress.address = walletPublicKey;
            return yield this.balance_by_address(walletAddress);
        });
    }
    balance_by_address(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const account = yield server.loadAccount(options.address);
            const balances = [];
            for (const balance of account.balances) {
                if (!balance.asset_code) {
                    balance.asset_code = "XLM";
                }
                balances.push({ asset: balance.asset_code, amount: balance.balance });
            }
            return balances;
        });
    }
    transfer(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const secret = yield this.getWalletSecret(options.name);
            if (!secret) {
                throw Error(`Couldn't find a wallet with name ${options.name}`);
            }
            const sourceKeypair = StellarSdk.Keypair.fromSecret(secret);
            const sourcePublicKey = sourceKeypair.publicKey();
            const sourceAccount = yield server.loadAccount(sourcePublicKey);
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
            const fee = yield server.fetchBaseFee();
            const memo = StellarSdk.Memo.text(options.memo);
            const transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
                fee: fee,
                networkPassphrase: StellarSdk.Networks.PUBLIC,
                memo: memo,
            })
                .addOperation(StellarSdk.Operation.payment({
                destination: options.target_address,
                asset: asset,
                amount: options.amount.toString(),
            }))
                .setTimeout(30)
                .build();
            transaction.sign(sourceKeypair);
            console.log(transaction.toEnvelope().toXDR("base64"));
            try {
                const transactionResult = yield server.submitTransaction(transaction);
                console.log(JSON.stringify(transactionResult, null, 2));
                console.log("Success! View the transaction at: ", transactionResult._links.transaction.href);
                return transactionResult._links.transaction.href;
            }
            catch (e) {
                console.log("An error has occured:", e);
                throw Error(e);
            }
        });
    }
    delete(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const [path, data] = yield this._load();
            if (!data[options.name]) {
                throw Error(`Couldn't find a wallet with name ${options.name}`);
            }
            yield this.backendStorage.update(path, options.name, "", StorageUpdateAction.delete);
            return "Deleted";
        });
    }
}
__decorate([
    expose,
    validateInput,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [WalletImportModel]),
    __metadata("design:returntype", Promise)
], Stellar.prototype, "import", null);
__decorate([
    expose,
    validateInput,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [WalletGetModel]),
    __metadata("design:returntype", Promise)
], Stellar.prototype, "get", null);
__decorate([
    expose,
    validateInput,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [WalletImportModel]),
    __metadata("design:returntype", Promise)
], Stellar.prototype, "update", null);
__decorate([
    expose,
    validateInput,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [WalletGetModel]),
    __metadata("design:returntype", Promise)
], Stellar.prototype, "exist", null);
__decorate([
    expose,
    validateInput,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], Stellar.prototype, "list", null);
__decorate([
    expose,
    validateInput,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [WalletBalanceByNameModel]),
    __metadata("design:returntype", Promise)
], Stellar.prototype, "balance_by_name", null);
__decorate([
    expose,
    validateInput,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [WalletBalanceByAddressModel]),
    __metadata("design:returntype", Promise)
], Stellar.prototype, "balance_by_address", null);
__decorate([
    expose,
    validateInput,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [WalletTransferModel]),
    __metadata("design:returntype", Promise)
], Stellar.prototype, "transfer", null);
__decorate([
    expose,
    validateInput,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [WalletDeleteModel]),
    __metadata("design:returntype", Promise)
], Stellar.prototype, "delete", null);
export { Stellar as stellar };
