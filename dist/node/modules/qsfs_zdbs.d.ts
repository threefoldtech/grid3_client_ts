import { BaseModule } from "./base";
import { QSFSZDBSModel, QSFSZDBGetModel, QSFSZDBDeleteModel } from "./models";
import { ZdbHL } from "../high_level/zdb";
import { TwinDeployment } from "../high_level/models";
import { MessageBusClientInterface } from "ts-rmb-client-base";
import { WorkloadTypes } from "../zos/workload";
declare class QSFSZdbsModule extends BaseModule {
    twin_id: number;
    url: string;
    mnemonic: string;
    rmbClient: MessageBusClientInterface;
    fileName: string;
    workloadTypes: WorkloadTypes[];
    zdb: ZdbHL;
    constructor(twin_id: number, url: string, mnemonic: string, rmbClient: MessageBusClientInterface);
    _createDeployment(options: QSFSZDBSModel): TwinDeployment[];
    deploy(options: QSFSZDBSModel): Promise<{
        contracts: {
            created: any[];
            updated: any[];
            deleted: any[];
        };
    }>;
    list(): string[];
    get(options: QSFSZDBGetModel): Promise<any[]>;
    delete(options: QSFSZDBDeleteModel): Promise<{
        deleted: any[];
        updated: any[];
    }>;
    getZdbs(name: any): Promise<{
        meta: any[];
        groups: any[];
    }>;
}
export { QSFSZdbsModule };
//# sourceMappingURL=qsfs_zdbs.d.ts.map