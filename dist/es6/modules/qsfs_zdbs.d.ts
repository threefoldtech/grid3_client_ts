import { GridClientConfig } from "../config";
import { TwinDeployment } from "../high_level/models";
import { ZdbHL } from "../high_level/zdb";
import { WorkloadTypes } from "../zos/workload";
import { BaseModule } from "./base";
import { QSFSZDBDeleteModel, QSFSZDBGetModel, QSFSZDBSModel } from "./models";
declare class QSFSZdbsModule extends BaseModule {
    moduleName: string;
    workloadTypes: WorkloadTypes[];
    zdb: ZdbHL;
    constructor(config: GridClientConfig);
    _createDeployment(options: QSFSZDBSModel): Promise<TwinDeployment[]>;
    deploy(options: QSFSZDBSModel): Promise<{
        contracts: {
            created: any[];
            updated: any[];
            deleted: any[];
        };
    }>;
    list(): Promise<string[]>;
    get(options: QSFSZDBGetModel): Promise<any[]>;
    delete(options: QSFSZDBDeleteModel): Promise<{
        created: any[];
        deleted: any[];
        updated: any[];
    }>;
    getZdbs(name: string): Promise<{
        meta: any[];
        groups: any[];
    }>;
}
export { QSFSZdbsModule as qsfs_zdbs };
//# sourceMappingURL=qsfs_zdbs.d.ts.map