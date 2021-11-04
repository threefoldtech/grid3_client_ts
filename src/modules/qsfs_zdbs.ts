import { BaseModule } from "./base";
import { QSFSZDBSModel, QSFSZDBGetModel, QSFSZDBDeleteModel } from "./models";
import { ZdbHL } from "../high_level/zdb";
import { TwinDeployment } from "../high_level/models";
import { MessageBusClientInterface } from "ts-rmb-client-base";
import { ZdbModes } from "../zos/zdb";
import { WorkloadTypes } from "../zos/workload";
import { ZdbBackend } from "../zos/qsfs";
import { expose } from "../helpers/expose";
import { BackendStorageType } from "../storage/backend";

class QSFSZdbsModule extends BaseModule {
    fileName = "qsfs_zdbs.json";
    workloadTypes = [WorkloadTypes.zdb];
    zdb: ZdbHL;
    constructor(
        public twin_id: number,
        public url: string,
        public mnemonic: string,
        public rmbClient: MessageBusClientInterface,
        public storePath: string,
        public projectName = "",
        public backendStorageType: BackendStorageType = BackendStorageType.default,
    ) {
        super(twin_id, url, mnemonic, rmbClient, storePath, projectName, backendStorageType);
        this.zdb = new ZdbHL(twin_id, url, mnemonic, rmbClient, this.storePath);
    }

    _createDeployment(options: QSFSZDBSModel): TwinDeployment[] {
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
            const twinDeployment = this.zdb.create(
                options.name + i,
                nodeId,
                options.disk_size,
                mode as ZdbModes,
                options.password,
                true,
                options.metadata,
                options.description,
            );
            twinDeployments.push(twinDeployment);
        }
        return twinDeployments;
    }

    @expose
    async deploy(options: QSFSZDBSModel) {
        if (await this.exists(options.name)) {
            throw Error(`Another QSFS zdbs deployment with the same name ${options.name} is already exist`);
        }
        const twinDeployments = this._createDeployment(options);
        const contracts = await this.twinDeploymentHandler.handle(twinDeployments);
        await this.save(options.name, contracts);
        return { contracts: contracts };
    }

    @expose
    async list() {
        return await this._list();
    }

    @expose
    async get(options: QSFSZDBGetModel) {
        return await this._get(options.name);
    }

    @expose
    async delete(options: QSFSZDBDeleteModel) {
        return await this._delete(options.name);
    }

    async getZdbs(name: string) {
        const deployments = await this._get(name);
        const zdbs = [];
        for (const deployment of deployments) {
            for (const workload of deployment.workloads) {
                if (workload.type !== WorkloadTypes.zdb) {
                    continue;
                }
                zdbs.push(workload);
            }
        }
        const qsfsZdbs = { meta: [], groups: [] };
        for (const zdb of zdbs) {
            const zdbBackend = new ZdbBackend();
            zdbBackend.namespace = zdb.result.data.Namespace;
            zdbBackend.password = zdb.data.password;
            zdbBackend.address = `[${zdb.result.data.IPs[1]}]:${zdb.result.data.Port}`;
            if (zdb.data.mode === ZdbModes.user) {
                qsfsZdbs.meta.push(zdbBackend);
            } else {
                qsfsZdbs.groups.push(zdbBackend);
            }
        }
        return qsfsZdbs;
    }
}

export { QSFSZdbsModule as qsfs_zdbs };
