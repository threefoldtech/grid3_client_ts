var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { BaseModule } from "./base";
import { ZdbHL } from "../high_level/zdb";
import { ZdbModes } from "../zos/zdb";
import { WorkloadTypes } from "../zos/workload";
import { ZdbBackend } from "../zos/qsfs";
class QSFSZdbsModule extends BaseModule {
    constructor(twin_id, url, mnemonic, rmbClient, storePath) {
        super(twin_id, url, mnemonic, rmbClient, storePath);
        this.twin_id = twin_id;
        this.url = url;
        this.mnemonic = mnemonic;
        this.rmbClient = rmbClient;
        this.storePath = storePath;
        this.fileName = "qsfs_zdbs.json";
        this.workloadTypes = [WorkloadTypes.zdb];
        this.zdb = new ZdbHL(twin_id, url, mnemonic, rmbClient, this.storePath);
    }
    _createDeployment(options) {
        if (options.count < 3) {
            throw Error("QSFS zdbs count can't be less than 3");
        }
        const count = options.count + 4; // 4 zdbs for meta
        const twinDeployments = [];
        for (let i = 1; i <= count; i++) {
            let mode = "seq";
            if (i > options.count) {
                mode = "user";
            }
            const nodeId = options.node_ids[(i - 1) % options.node_ids.length];
            const twinDeployment = this.zdb.create(options.name + i, nodeId, options.namespace, options.disk_size, options.disk_type, mode, options.password, true, options.metadata, options.description);
            twinDeployments.push(twinDeployment);
        }
        return twinDeployments;
    }
    deploy(options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.exists(options.name)) {
                throw Error(`Another QSFS zdbs deployment with the same name ${options.name} is already exist`);
            }
            const twinDeployments = this._createDeployment(options);
            const contracts = yield this.twinDeploymentHandler.handle(twinDeployments);
            this.save(options.name, contracts);
            return { contracts: contracts };
        });
    }
    list() {
        return this._list();
    }
    get(options) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._get(options.name);
        });
    }
    delete(options) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._delete(options.name);
        });
    }
    getZdbs(name) {
        return __awaiter(this, void 0, void 0, function* () {
            const deployments = yield this._get(name);
            const zdbs = [];
            for (const deployment of deployments) {
                for (const workload of deployment.workloads) {
                    if (workload.type !== WorkloadTypes.zdb) {
                        continue;
                    }
                    zdbs.push(workload.data);
                }
            }
            const qsfsZdbs = { meta: [], groups: [] };
            for (const zdb of zdbs) {
                const zdbBackend = new ZdbBackend();
                zdbBackend.namespace = zdb.namespace;
                zdbBackend.password = zdb.password;
                zdbBackend.address = `[${zdb.result.data.ips[0]}]:${zdb.result.data.port}`;
                if (zdb.mode === ZdbModes.user) {
                    qsfsZdbs.meta.push(zdbBackend);
                }
                else {
                    qsfsZdbs.groups.push(zdbBackend);
                }
            }
            return qsfsZdbs;
        });
    }
}
export { QSFSZdbsModule };
