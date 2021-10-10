import { BaseModule } from "./base";
import { ZDBS, DeleteZDB, AddZDB, ZDBGet, ZDBDelete } from "./models";
import { ZdbHL } from "../high_level/zdb";
import { TwinDeployment } from "../high_level/models";
import { MessageBusClientInterface } from "ts-rmb-client-base";
declare class Zdbs extends BaseModule {
    twin_id: number;
    url: string;
    mnemonic: string;
    rmbClient: MessageBusClientInterface;
    fileName: string;
    zdb: ZdbHL;
    constructor(twin_id: number, url: string, mnemonic: string, rmbClient: MessageBusClientInterface);
    _createDeployment(options: ZDBS): TwinDeployment[];
    deploy(options: ZDBS): Promise<{
        contracts: {
            created: any[];
            updated: any[];
            deleted: any[];
        };
    }>;
    list(): string[];
    get(options: ZDBGet): Promise<any[]>;
    delete(options: ZDBDelete): Promise<{
        deleted: any[];
        updated: any[];
    }>;
    update(options: ZDBS): Promise<"Nothing found to update" | {
        contracts: {
            created: any[];
            updated: any[];
            deleted: any[];
        };
    }>;
    add_zdb(options: AddZDB): Promise<{
        contracts: {
            created: any[];
            updated: any[];
            deleted: any[];
        };
    }>;
    delete_zdb(options: DeleteZDB): Promise<{
        created: any[];
        updated: any[];
        deleted: any[];
    }>;
}
export { Zdbs };
//# sourceMappingURL=zdb.d.ts.map