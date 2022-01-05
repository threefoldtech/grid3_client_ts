import { MessageBusClientInterface } from "ts-rmb-client-base";

import { KeypairType } from "./clients/tf-grid/client";
import { BackendStorageType } from "./storage/backend";
import BackendInterface from "./storage/BackendInterface";

enum NetworkEnv {
    dev = "dev",
    test = "test",
}

class GridClientConfig {
    network: NetworkEnv;
    mnemonic: string;
    storeSecret: string | Uint8Array;
    rmbClient: MessageBusClientInterface;
    projectName: string;
    backendStorageType: BackendStorageType;
    backendStorage: BackendInterface;
    keypairType: KeypairType;
    storePath: string;
    graphqlURL: string;
    substrateURL: string;
    twinId: number;
}

export { GridClientConfig, NetworkEnv };
