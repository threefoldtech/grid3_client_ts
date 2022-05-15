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
import { KeypairType, TFClient } from "./clients/tf-grid/client";
import { NetworkEnv } from "./config";
import * as modules from "./modules/index";
import { appPath } from "./storage/backend";
import { BackendStorage, BackendStorageType } from "./storage/backend";
class GridClient {
    constructor(network, mnemonic, storeSecret, rmbClient, projectName = "", backendStorageType = BackendStorageType.auto, keypairType = KeypairType.sr25519, signer = null) {
        this.network = network;
        this.mnemonic = mnemonic;
        this.storeSecret = storeSecret;
        this.rmbClient = rmbClient;
        this.projectName = projectName;
        this.backendStorageType = backendStorageType;
        this.keypairType = keypairType;
        this.signer = signer;
    }
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            const urls = this.getDefaultUrls(this.network);
            const tfclient = new TFClient(urls.substrate, this.mnemonic, this.storeSecret, this.keypairType, this.signer);
            yield tfclient.connect();
            if (BackendStorage.isEnvNode()) {
                process.on("SIGTERM", this.disconnectAndExit);
                process.on("SIGINT", this.disconnectAndExit);
                process.on("SIGUSR1", this.disconnectAndExit);
                process.on("SIGUSR2", this.disconnectAndExit);
            }
            else {
                window.onbeforeunload = () => {
                    return "";
                };
                window.onunload = this.disconnect;
            }
            try {
                this.twinId = yield tfclient.twins.getMyTwinId();
            }
            catch (e) {
                console.log(e);
                throw Error(`Couldn't find a user for the provided mnemonic on ${this.network} network.`);
            }
            this._connect();
        });
    }
    _connect() {
        const urls = this.getDefaultUrls(this.network);
        this.rmbClient["twinId"] = this.twinId;
        this.rmbClient["proxyURL"] = urls.rmbProxy;
        this.rmbClient["graphqlURL"] = urls.graphql;
        this.rmbClient["mnemonic"] = this.mnemonic;
        this.rmbClient["keypairType"] = this.keypairType;
        this.rmbClient["verifyResponse"] = true;
        const storePath = PATH.join(appPath, this.network, String(this.twinId));
        GridClient.config = {
            network: this.network,
            mnemonic: this.mnemonic,
            storeSecret: this.storeSecret,
            rmbClient: this.rmbClient,
            projectName: this.projectName,
            backendStorageType: this.backendStorageType,
            keypairType: this.keypairType,
            storePath: storePath,
            graphqlURL: urls.graphql,
            substrateURL: urls.substrate,
            twinId: this.twinId,
            signer: this.signer,
        };
        for (const module of Object.getOwnPropertyNames(modules).filter(item => typeof modules[item] === "function")) {
            if (module.includes("Model")) {
                continue;
            }
            this[module] = new modules[module](GridClient.config);
        }
    }
    getDefaultUrls(network) {
        const urls = { rmbProxy: "", substrate: "", graphql: "" };
        if (network === NetworkEnv.dev) {
            urls.rmbProxy = "https://gridproxy.dev.grid.tf";
            urls.substrate = "wss://tfchain.dev.grid.tf/ws";
            urls.graphql = "https://graphql.dev.grid.tf/graphql";
        }
        else if (network === NetworkEnv.test) {
            urls.rmbProxy = "https://gridproxy.test.grid.tf";
            urls.substrate = "wss://tfchain.test.grid.tf/ws";
            urls.graphql = "https://graphql.test.grid.tf/graphql";
        }
        else if (network === NetworkEnv.main) {
            urls.rmbProxy = "https://gridproxy.grid.tf";
            urls.substrate = "wss://tfchain.grid.tf/ws";
            urls.graphql = "https://graph.grid.tf/graphql";
        }
        return urls;
    }
    disconnect() {
        return __awaiter(this, void 0, void 0, function* () {
            for (const key of Object.keys(TFClient.clients)) {
                yield TFClient.clients[key].disconnect();
            }
        });
    }
    disconnectAndExit() {
        return __awaiter(this, void 0, void 0, function* () {
            // this should be only used by nodejs process
            for (const key of Object.keys(TFClient.clients)) {
                yield TFClient.clients[key].disconnect();
            }
            process.exit(0);
        });
    }
}
export { GridClient };
