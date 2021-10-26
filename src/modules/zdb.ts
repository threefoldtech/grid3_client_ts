import { BaseModule } from "./base";
import { ZDBSModel, DeleteZDBModel, AddZDBModel, ZDBGetModel, ZDBDeleteModel } from "./models";
import { ZdbHL } from "../high_level/zdb";
import { TwinDeployment } from "../high_level/models";
import { MessageBusClientInterface } from "ts-rmb-client-base";
import { WorkloadTypes } from "../zos/workload";

class ZdbsModule extends BaseModule {
    fileName = "zdbs.json";
    workloadTypes = [WorkloadTypes.zdb];
    zdb: ZdbHL;
    constructor(
        public twin_id: number,
        public url: string,
        public mnemonic: string,
        public rmbClient: MessageBusClientInterface,
        public storePath: string,
        projectName = "",
    ) {
        super(twin_id, url, mnemonic, rmbClient, storePath, projectName);
        this.zdb = new ZdbHL(twin_id, url, mnemonic, rmbClient, this.storePath);
    }

    _createDeployment(options: ZDBSModel): TwinDeployment[] {
        const twinDeployments = [];
        for (const instance of options.zdbs) {
            const twinDeployment = this.zdb.create(
                instance.name,
                instance.node_id,
                instance.disk_size,
                instance.mode,
                instance.password,
                instance.public,
                options.metadata,
                options.description,
            );
            twinDeployments.push(twinDeployment);
        }
        return twinDeployments;
    }

    async deploy(options: ZDBSModel) {
        if (this.exists(options.name)) {
            throw Error(`Another zdb deployment with the same name ${options.name} is already exist`);
        }
        const twinDeployments = this._createDeployment(options);
        const contracts = await this.twinDeploymentHandler.handle(twinDeployments);
        this.save(options.name, contracts);
        return { contracts: contracts };
    }

    list() {
        return this._list();
    }

    async get(options: ZDBGetModel) {
        return await this._get(options.name);
    }

    async delete(options: ZDBDeleteModel) {
        return await this._delete(options.name);
    }

    async update(options: ZDBSModel) {
        if (!this.exists(options.name)) {
            throw Error(`There is no zdb deployment with name: ${options.name}`);
        }
        const oldDeployments = await this._get(options.name);
        const twinDeployments = this._createDeployment(options);
        return await this._update(this.zdb, options.name, oldDeployments, twinDeployments);
    }

    async addZdb(options: AddZDBModel) {
        if (!this.exists(options.deployment_name)) {
            throw Error(`There is no zdb deployment with name: ${options.deployment_name}`);
        }
        const oldDeployments = await this._get(options.deployment_name);
        const twinDeployment = this.zdb.create(
            options.name,
            options.node_id,
            options.disk_size,
            options.mode,
            options.password,
            options.public,
            oldDeployments[0].metadata,
            oldDeployments[0].metadata,
        );

        return await this._add(options.deployment_name, options.node_id, oldDeployments, [twinDeployment]);
    }

    async deleteZdb(options: DeleteZDBModel) {
        if (!this.exists(options.deployment_name)) {
            throw Error(`There is no zdb deployment with name: ${options.deployment_name}`);
        }
        return await this._deleteInstance(this.zdb, options.deployment_name, options.name);
    }
}

export { ZdbsModule };
