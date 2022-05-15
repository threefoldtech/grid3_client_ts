import { GridClientConfig } from "../config";
import { TwinDeployment } from "../high_level/models";
import { ZdbHL } from "../high_level/zdb";
import { WorkloadTypes } from "../zos/workload";
import { BaseModule } from "./base";
import { AddZDBModel, DeleteZDBModel, ZDBDeleteModel, ZDBGetModel, ZDBSModel } from "./models";
declare class ZdbsModule extends BaseModule {
    fileName: string;
    workloadTypes: WorkloadTypes[];
    zdb: ZdbHL;
    constructor(config: GridClientConfig);
    _createDeployment(options: ZDBSModel): Promise<TwinDeployment[]>;
    deploy(options: ZDBSModel): Promise<{
        contracts: {
            created: any[];
            updated: any[];
            deleted: any[];
        };
    }>;
    list(): Promise<string[]>;
    getObj(deploymentName: string): Promise<any[]>;
    get(options: ZDBGetModel): Promise<any[]>;
    delete(options: ZDBDeleteModel): Promise<{
        created: any[];
        deleted: any[];
        updated: any[];
    }>;
    update(options: ZDBSModel): Promise<"Nothing found to update" | {
        contracts: {
            created: any[];
            updated: any[];
            deleted: any[];
        };
    }>;
    add_zdb(options: AddZDBModel): Promise<{
        contracts: {
            created: any[];
            updated: any[];
            deleted: any[];
        };
    }>;
    delete_zdb(options: DeleteZDBModel): Promise<{
        created: any[];
        updated: any[];
        deleted: any[];
    }>;
}
export { ZdbsModule as zdbs };
//# sourceMappingURL=zdb.d.ts.map