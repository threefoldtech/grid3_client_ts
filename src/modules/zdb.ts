import { GridClientConfig } from "../config";
import { expose } from "../helpers/expose";
import { validateInput } from "../helpers/validator";
import { TwinDeployment } from "../high_level/models";
import { ZdbHL } from "../high_level/zdb";
import { WorkloadTypes } from "../zos/workload";
import { Zdb, ZdbResult } from "../zos/zdb";
import { BaseModule } from "./base";
import { AddZDBModel, DeleteZDBModel, ZDBDeleteModel, ZDBGetModel, ZDBSModel } from "./models";
import { checkBalance } from "./utils";

class ZdbsModule extends BaseModule {
    fileName = "zdbs.json";
    workloadTypes = [WorkloadTypes.zdb];
    zdb: ZdbHL;
    constructor(config: GridClientConfig) {
        super(config);
        this.zdb = new ZdbHL(config);
    }

    async _createDeployment(options: ZDBSModel): Promise<TwinDeployment[]> {
        const twinDeployments = [];
        for (const instance of options.zdbs) {
            const twinDeployment = await this.zdb.create(
                instance.name,
                instance.node_id,
                instance.disk_size,
                instance.mode,
                instance.password,
                instance.publicNamespace,
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
    async deploy(options: ZDBSModel) {
        if (await this.exists(options.name)) {
            throw Error(`Another zdb deployment with the same name ${options.name} already exists`);
        }
        const twinDeployments = await this._createDeployment(options);
        const contracts = await this.twinDeploymentHandler.handle(twinDeployments);
        await this.save(options.name, contracts);
        return { contracts: contracts };
    }

    @expose
    async list() {
        return await this._list();
    }

    async getObj(deploymentName: string) {
        const deployments = await this._get(deploymentName);
        const workloads = await this._getWorkloadsByTypes(deploymentName, deployments, [WorkloadTypes.zdb]);
        const ret = [];
        for (const workload of workloads) {
            const data = workload.data as Zdb;
            ret.push({
                version: workload.version,
                contractId: workload["contractId"],
                nodeId: workload["nodeId"],
                name: workload.name,
                created: workload.result.created,
                status: workload.result.state,
                message: workload.result.message,
                size: data.size, // GB
                mode: data.mode,
                publicNamespace: data.public,
                password: data.password,
                metadata: workload.metadata,
                description: workload.description,
                resData: workload.result.data as ZdbResult,
            });
        }
        return ret;
    }

    @expose
    @validateInput
    async get(options: ZDBGetModel) {
        return await this._get(options.name);
    }

    @expose
    @validateInput
    @checkBalance
    async delete(options: ZDBDeleteModel) {
        return await this._delete(options.name);
    }

    @expose
    @validateInput
    @checkBalance
    async update(options: ZDBSModel) {
        if (!(await this.exists(options.name))) {
            throw Error(`There is no zdb deployment with name: ${options.name}`);
        }
        const oldDeployments = await this._get(options.name);
        const twinDeployments = await this._createDeployment(options);
        return await this._update(this.zdb, options.name, oldDeployments, twinDeployments);
    }

    @expose
    @validateInput
    @checkBalance
    async add_zdb(options: AddZDBModel) {
        if (!(await this.exists(options.deployment_name))) {
            throw Error(`There is no zdb deployment with name: ${options.deployment_name}`);
        }
        const oldDeployments = await this._get(options.deployment_name);
        const twinDeployment = await this.zdb.create(
            options.name,
            options.node_id,
            options.disk_size,
            options.mode,
            options.password,
            options.publicNamespace,
            oldDeployments[0].metadata,
            oldDeployments[0].metadata,
        );

        return await this._add(options.deployment_name, options.node_id, oldDeployments, [twinDeployment]);
    }

    @expose
    @validateInput
    @checkBalance
    async delete_zdb(options: DeleteZDBModel) {
        if (!(await this.exists(options.deployment_name))) {
            throw Error(`There is no zdb deployment with name: ${options.deployment_name}`);
        }
        return await this._deleteInstance(this.zdb, options.deployment_name, options.name);
    }
}

export { ZdbsModule as zdbs };
