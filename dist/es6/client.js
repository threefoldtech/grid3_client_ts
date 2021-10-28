import * as PATH from "path";
import { MachineModule } from "./modules/machine";
import { K8sModule } from "./modules/k8s";
import { ZdbsModule } from "./modules/zdb";
import { GWModule } from "./modules/gateway";
import { QSFSZdbsModule } from "./modules/qsfs_zdbs";
import { appPath } from "./helpers/jsonfs";
class GridClient {
    constructor(twin_id, url, mnemonic, rmbClient, projectName = "") {
        this.twin_id = twin_id;
        this.url = url;
        this.mnemonic = mnemonic;
        this.rmbClient = rmbClient;
        let env = "mainnet";
        if (this.url.includes("dev")) {
            env = "devnet";
        }
        else if (this.url.includes("test")) {
            env = "testnet";
        }
        const storePath = PATH.join(appPath, String(twin_id), env);
        this.machines = new MachineModule(twin_id, url, mnemonic, rmbClient, storePath, projectName);
        this.k8s = new K8sModule(twin_id, url, mnemonic, rmbClient, storePath, projectName);
        this.zdbs = new ZdbsModule(twin_id, url, mnemonic, rmbClient, storePath, projectName);
        this.gateway = new GWModule(twin_id, url, mnemonic, rmbClient, storePath, projectName);
        this.qsfs_zdbs = new QSFSZdbsModule(twin_id, url, mnemonic, rmbClient, storePath, projectName);
    }
}
export { GridClient };
