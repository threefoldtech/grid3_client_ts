"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.stellar = void 0;
const PATH = __importStar(require("path"));
const stellar_sdk_1 = __importDefault(require("stellar-sdk"));
const expose_1 = require("../helpers/expose");
const validator_1 = require("../helpers/validator");
const backend_1 = require("../storage/backend");
const _1 = require(".");
const server = new stellar_sdk_1.default.Server("https://horizon.stellar.org");
class Stellar {
    fileName = "stellar.json";
    backendStorage;
    constructor(config) {
        this.backendStorage = new backend_1.BackendStorage(config.backendStorageType, config.substrateURL, config.mnemonic, config.storeSecret, config.keypairType);
    }
    async _load() {
        const path = PATH.join(backend_1.appPath, this.fileName);
        let data = await this.backendStorage.load(path);
        if (!data) {
            data = {};
        }
        return [path, data];
    }
    async save(name, secret) {
        const [path, data] = await this._load();
        if (data[name]) {
            throw Error(`A wallet with the same name ${name} already exists`);
        }
        await this.backendStorage.update(path, name, secret);
    }
    async getWalletSecret(name) {
        const [, data] = await this._load();
        return data[name];
    }
    async import(options) {
        const walletKeypair = stellar_sdk_1.default.Keypair.fromSecret(options.secret);
        const walletPublicKey = walletKeypair.publicKey();
        await server.loadAccount(walletPublicKey);
        await this.save(options.name, options.secret);
        return walletPublicKey;
    }
    async get(options) {
        const secret = await this.getWalletSecret(options.name);
        const walletKeypair = stellar_sdk_1.default.Keypair.fromSecret(secret);
        return walletKeypair.publicKey(); // TODO: return wallet secret after adding security context on the server calls
    }
    async update(options) {
        if (!(await this.exist(options))) {
            throw Error(`Couldn't find a wallet with name ${options.name} to update`);
        }
        const secret = await this.getWalletSecret(options.name);
        const deleteWallet = new _1.WalletDeleteModel();
        deleteWallet.name = options.name;
        await this.delete(deleteWallet);
        try {
            return await this.import(options);
        }
        catch (e) {
            const oldSecret = options.secret;
            options.secret = secret;
            await this.import(options);
            throw Error(`Couldn't import wallet with the secret ${oldSecret} due to: ${e}`);
        }
    }
    async exist(options) {
        return (await this.list()).includes(options.name);
    }
    async list() {
        const [, data] = await this._load();
        return Object.keys(data);
    }
    async balance_by_name(options) {
        const secret = await this.getWalletSecret(options.name);
        if (!secret) {
            throw Error(`Couldn't find a wallet with name ${options.name}`);
        }
        const walletKeypair = stellar_sdk_1.default.Keypair.fromSecret(secret);
        const walletPublicKey = walletKeypair.publicKey();
        const walletAddress = new _1.WalletBalanceByAddressModel();
        walletAddress.address = walletPublicKey;
        return await this.balance_by_address(walletAddress);
    }
    async balance_by_address(options) {
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
    async transfer(options) {
        const secret = await this.getWalletSecret(options.name);
        if (!secret) {
            throw Error(`Couldn't find a wallet with name ${options.name}`);
        }
        const sourceKeypair = stellar_sdk_1.default.Keypair.fromSecret(secret);
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
        const asset = new stellar_sdk_1.default.Asset(options.asset, issuer);
        const fee = await server.fetchBaseFee();
        const memo = stellar_sdk_1.default.Memo.text(options.memo);
        const transaction = new stellar_sdk_1.default.TransactionBuilder(sourceAccount, {
            fee: fee,
            networkPassphrase: stellar_sdk_1.default.Networks.PUBLIC,
            memo: memo,
        })
            .addOperation(stellar_sdk_1.default.Operation.payment({
            destination: options.target_address,
            asset: asset,
            amount: options.amount.toString(),
        }))
            .setTimeout(30)
            .build();
        transaction.sign(sourceKeypair);
        console.log(transaction.toEnvelope().toXDR("base64"));
        try {
            const transactionResult = await server.submitTransaction(transaction);
            console.log(JSON.stringify(transactionResult, null, 2));
            console.log("Success! View the transaction at: ", transactionResult._links.transaction.href);
            return transactionResult._links.transaction.href;
        }
        catch (e) {
            console.log("An error has occured:", e);
            throw Error(e);
        }
    }
    async delete(options) {
        const [path, data] = await this._load();
        if (!data[options.name]) {
            throw Error(`Couldn't find a wallet with name ${options.name}`);
        }
        await this.backendStorage.update(path, options.name, "", backend_1.StorageUpdateAction.delete);
        return "Deleted";
    }
}
__decorate([
    expose_1.expose,
    validator_1.validateInput,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [_1.WalletImportModel]),
    __metadata("design:returntype", Promise)
], Stellar.prototype, "import", null);
__decorate([
    expose_1.expose,
    validator_1.validateInput,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [_1.WalletGetModel]),
    __metadata("design:returntype", Promise)
], Stellar.prototype, "get", null);
__decorate([
    expose_1.expose,
    validator_1.validateInput,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [_1.WalletImportModel]),
    __metadata("design:returntype", Promise)
], Stellar.prototype, "update", null);
__decorate([
    expose_1.expose,
    validator_1.validateInput,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [_1.WalletGetModel]),
    __metadata("design:returntype", Promise)
], Stellar.prototype, "exist", null);
__decorate([
    expose_1.expose,
    validator_1.validateInput,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], Stellar.prototype, "list", null);
__decorate([
    expose_1.expose,
    validator_1.validateInput,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [_1.WalletBalanceByNameModel]),
    __metadata("design:returntype", Promise)
], Stellar.prototype, "balance_by_name", null);
__decorate([
    expose_1.expose,
    validator_1.validateInput,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [_1.WalletBalanceByAddressModel]),
    __metadata("design:returntype", Promise)
], Stellar.prototype, "balance_by_address", null);
__decorate([
    expose_1.expose,
    validator_1.validateInput,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [_1.WalletTransferModel]),
    __metadata("design:returntype", Promise)
], Stellar.prototype, "transfer", null);
__decorate([
    expose_1.expose,
    validator_1.validateInput,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [_1.WalletDeleteModel]),
    __metadata("design:returntype", Promise)
], Stellar.prototype, "delete", null);
exports.stellar = Stellar;
