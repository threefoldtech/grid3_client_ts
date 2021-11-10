import { MessageBusClientInterface } from "ts-rmb-client-base";
import { BackendStorageType } from "./storage/backend";
import { KeypairType } from "./clients/tf-grid/client";

enum NetworkEnv {
    dev = "dev",
    test = "test",
}

class GridClientConfig {
    network: NetworkEnv;
    mnemonic: string;
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
