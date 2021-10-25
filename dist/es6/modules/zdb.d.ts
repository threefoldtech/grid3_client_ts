import { BaseModule } from "./base";
import { ZDBSModel, DeleteZDBModel, AddZDBModel, ZDBGetModel, ZDBDeleteModel } from "./models";
<<<<<<< HEAD
=======
import { WorkloadTypes } from "../zos/workload";
>>>>>>> update scripts
import { ZdbHL } from "../high_level/zdb";
import { TwinDeployment } from "../high_level/models";
import { MessageBusClientInterface } from "ts-rmb-client-base";
declare class ZdbsModule extends BaseModule {
    twin_id: number;
    url: string;
    mnemonic: string;
    rmbClient: MessageBusClientInterface;
    storePath: string;
    fileName: string;
    workloadTypes: WorkloadTypes[];
    zdb: ZdbHL;
    constructor(twin_id: number, url: string, mnemonic: string, rmbClient: MessageBusClientInterface, storePath: string, projectName?: string);
    _createDeployment(options: ZDBSModel): TwinDeployment[];
    deploy(options: ZDBSModel): Promise<{
        contracts: {
            created: any[];
            updated: any[];
            deleted: any[];
        };
    }>;
    list(): string[];
<<<<<<< HEAD
=======
    getObj(deploymentName: string): Promise<any[]>;
>>>>>>> update scripts
    get(options: ZDBGetModel): Promise<any[]>;
    delete(options: ZDBDeleteModel): Promise<{
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
    addZdb(options: AddZDBModel): Promise<{
        contracts: {
            created: any[];
            updated: any[];
            deleted: any[];
        };
    }>;
    deleteZdb(options: DeleteZDBModel): Promise<{
        created: any[];
        updated: any[];
        deleted: any[];
    }>;
}
export { ZdbsModule };
//# sourceMappingURL=zdb.d.ts.map