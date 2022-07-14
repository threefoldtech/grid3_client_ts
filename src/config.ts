import { MessageBusClientInterface } from "ts-rmb-client-base";

import { BackendStorageType } from "./storage/backend";
import { KeypairType } from "./zos/deployment";

enum NetworkEnv {
    dev = "dev",
    test = "test",
    main = "main",
    qa = "qa",
}

class GridClientConfig {
    network: NetworkEnv;
    mnemonic: string;
    storeSecret: string | Uint8Array;
    rmbClient: MessageBusClientInterface;
    projectName: string;
    backendStorageType: BackendStorageType;
    keypairType: KeypairType;
    storePath: string;
    graphqlURL: string;
    substrateURL: string;
    twinId: number;
}

export { GridClientConfig, NetworkEnv };
