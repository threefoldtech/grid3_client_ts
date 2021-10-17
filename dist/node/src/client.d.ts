import { MessageBusClientInterface } from "ts-rmb-client-base";
import { MachineModule } from "./modules/machine";
import { K8sModule } from "./modules/k8s";
import { ZdbsModule } from "./modules/zdb";
import { GWModule } from "./modules/gateway";
import { QSFSZdbsModule } from "./modules/qsfs_zdbs";
declare class GridClient {
    twin_id: number;
    url: string;
    mnemonic: string;
    rmbClient: MessageBusClientInterface;
    machines: MachineModule;
    k8s: K8sModule;
    zdbs: ZdbsModule;
    gateway: GWModule;
    qsfs_zdbs: QSFSZdbsModule;
    constructor(twin_id: number, url: string, mnemonic: string, rmbClient: MessageBusClientInterface);
}
export { GridClient };
//# sourceMappingURL=client.d.ts.map