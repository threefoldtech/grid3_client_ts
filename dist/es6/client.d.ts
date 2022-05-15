import { MessageBusClientInterface } from "ts-rmb-client-base";
import { KeypairType } from "./clients/tf-grid/client";
import { GridClientConfig, NetworkEnv } from "./config";
import * as modules from "./modules/index";
import { BackendStorageType } from "./storage/backend";
declare class GridClient {
    network: NetworkEnv;
    mnemonic: string;
    storeSecret: string | Uint8Array;
    rmbClient: MessageBusClientInterface;
    projectName: string;
    backendStorageType: BackendStorageType;
    keypairType: KeypairType;
    signer: any;
    static config: GridClientConfig;
    machines: modules.machines;
    k8s: modules.k8s;
    zdbs: modules.zdbs;
    gateway: modules.gateway;
    qsfs_zdbs: modules.qsfs_zdbs;
    zos: modules.zos;
    contracts: modules.contracts;
    twins: modules.twins;
    kvstore: modules.kvstore;
    balance: modules.balance;
    capacity: modules.capacity;
    twinId: number;
    nodes: modules.nodes;
    constructor(network: NetworkEnv, mnemonic: string, storeSecret: string | Uint8Array, rmbClient: MessageBusClientInterface, projectName?: string, backendStorageType?: BackendStorageType, keypairType?: KeypairType, signer?: any);
    connect(): Promise<void>;
    _connect(): void;
    getDefaultUrls(network: NetworkEnv): Record<string, string>;
    disconnect(): Promise<void>;
    disconnectAndExit(): Promise<void>;
}
export { GridClient };
//# sourceMappingURL=client.d.ts.map