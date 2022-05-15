import { TFClient } from "../clients/tf-grid/client";
import { GridClientConfig } from "../config";
import { TwinCreateModel, TwinDeleteModel, TwinGetByAccountIdModel, TwinGetModel } from "./models";
declare class Twins {
    client: TFClient;
    constructor(config: GridClientConfig);
    create(options: TwinCreateModel): Promise<any>;
    get(options: TwinGetModel): Promise<any>;
    get_my_twin_id(): Promise<number>;
    get_twin_id_by_account_id(options: TwinGetByAccountIdModel): Promise<number>;
    list(): Promise<any>;
    delete(options: TwinDeleteModel): Promise<any>;
}
export { Twins as twins };
//# sourceMappingURL=twins.d.ts.map