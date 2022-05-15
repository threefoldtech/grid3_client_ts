"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NetworkEnv = exports.GridClientConfig = void 0;
var NetworkEnv;
(function (NetworkEnv) {
    NetworkEnv["dev"] = "dev";
    NetworkEnv["test"] = "test";
    NetworkEnv["main"] = "main";
})(NetworkEnv || (NetworkEnv = {}));
exports.NetworkEnv = NetworkEnv;
class GridClientConfig {
    network;
    mnemonic;
    storeSecret;
    rmbClient;
    projectName;
    backendStorageType;
    keypairType;
    storePath;
    graphqlURL;
    substrateURL;
    twinId;
    signer;
}
exports.GridClientConfig = GridClientConfig;
