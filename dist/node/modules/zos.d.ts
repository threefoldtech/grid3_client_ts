import { GridClientConfig } from "../config";
import { ZOSModel } from "./models";
declare class Zos {
    config: GridClientConfig;
    constructor(config: GridClientConfig);
    deploy(options: ZOSModel): Promise<{
        created: any[];
        updated: any[];
        deleted: any[];
    }>;
}
export { Zos as zos };
//# sourceMappingURL=zos.d.ts.map