import { TFClient } from "../clients";
import { GridClientConfig } from "../config";
import { RentContractCreateModel, RentContractDeleteModel, RentContractGetModel } from "./models";
declare class Nodes {
    config: GridClientConfig;
    client: TFClient;
    constructor(config: GridClientConfig);
    reserve(options: RentContractCreateModel): Promise<any>;
    unreserve(options: RentContractDeleteModel): Promise<any>;
    getRent(options: RentContractGetModel): Promise<any>;
}
export { Nodes as nodes };
//# sourceMappingURL=nodes.d.ts.map