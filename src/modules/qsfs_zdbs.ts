import { GridClientConfig } from "../config";
import { expose } from "../helpers/expose";
import { validateInput } from "../helpers/validator";
import { TwinDeployment } from "../high_level/models";
import { ZdbHL } from "../high_level/zdb";
import { ZdbBackend } from "../zos/qsfs";
import { WorkloadTypes } from "../zos/workload";
import { ZdbModes } from "../zos/zdb";
import { BaseModule } from "./base";
import { QSFSZDBDeleteModel, QSFSZDBGetModel, QSFSZDBSModel } from "./models";
import { checkBalance } from "./utils";

class QSFSZdbsModule extends BaseModule {
    moduleName = "qsfs_zdbs";
    workloadTypes = [WorkloadTypes.zdb];
    zdb: ZdbHL;
    constructor(config: GridClientConfig) {
        super(config);
        this.zdb = new ZdbHL(config);
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
    @validateInput
    @checkBalance
    async deploy(options: QSFSZDBSModel) {
        if (await this.exists(options.name)) {
            throw Error(`Another QSFS zdbs deployment with the same name ${options.name} already exists`);
        }
        const twinDeployments = this._createDeployment(options);
        const contracts = await this.twinDeploymentHandler.handle(twinDeployments);
        await this.save(options.name, contracts);
        return { contracts: contracts };
    }

    @expose
    @validateInput
    async list() {
        return await this._list();
    }

    @expose
    @validateInput
    async get(options: QSFSZDBGetModel) {
        return await this._get(options.name);
    }

    @expose
    @validateInput
    @checkBalance
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
                workload["contractId"] = deployment.contract_id;
                workload["nodeId"] = await this._getNodeIdFromContractId(name, deployment.contract_id);
                zdbs.push(workload);
            }
        }
        const qsfsZdbs = { meta: [], groups: [] };
        for (const zdb of zdbs) {
            const zdbBackend = new ZdbBackend();
            zdbBackend.namespace = zdb.result.data.Namespace;
            zdbBackend.password = zdb.data.password;
            zdbBackend.address = `[${zdb.result.data.IPs[1]}]:${zdb.result.data.Port}`;
            zdbBackend["contractId"] = zdb["contractId"];
            zdbBackend["nodeId"] = zdb["nodeId"];
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
