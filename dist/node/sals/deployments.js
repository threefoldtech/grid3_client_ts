// import * as PATH from "path";
// import { MessageBusClientInterface } from "ts-rmb-client-base";
// import { Deployment } from "./models";
// import { BaseModule } from "../src/modules/base";
// import { BaseGetDeleteModel } from "../src/modules/models";
// import { loadFromFile, updatejson, appPath } from "../src/helpers/jsonfs";
// class DeploymentSals {
//     public twinClient: BaseModule;
//     private path: string = appPath;
//     constructor(twin_id: number, url: string, mnemonic: string, rmbClient: MessageBusClientInterface) {
//         this.twinClient = new BaseModule(twin_id, url, mnemonic, rmbClient);
//     }
//     private static getPath(type: string): string {
//         return PATH.join(appPath, `${type}.json`);
//     }
//     public getByType(type: string): Deployment[] {
//         const path = DeploymentSals.getPath(type);
//         const ds = loadFromFile(path);
//         Object.entries(ds).forEach(([solution, _]) => {
//             const dg = new BaseGetDeleteModel();
//             dg.name = solution;
//         });
//         return;
//     }
//     public getSolution(solution: BaseGetDeleteModel): Deployment {
//         return;
//     }
// }
// export { DeploymentSals };
