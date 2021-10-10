import { BaseModule } from "./base";
import { ZDBS, DeleteZDB, AddZDB, ZDBGet, ZDBDelete } from "./models";
import { ZdbHL } from "../high_level/zdb";
import { TwinDeployment } from "../high_level/models";
import { MessageBusClientInterface } from "ts-rmb-client-base";


class Zdbs extends BaseModule {
    fileName = "zdbs.json";
    zdb: ZdbHL;
    constructor(public twin_id: number, public url: string, public mnemonic: string, public rmbClient: MessageBusClientInterface) {
        super(twin_id, url, mnemonic, rmbClient);
        this.zdb = new ZdbHL(twin_id, url, mnemonic, rmbClient);
    }

    _createDeployment(options: ZDBS): TwinDeployment[] {
        const twinDeployments = [];
        for (const instance of options.zdbs) {
            const twinDeployment = this.zdb.create(
                instance.name,
                instance.node_id,
                instance.namespace,
                instance.disk_size,
                instance.disk_type,
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

    async deploy(options: ZDBS) {
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

    async get(options: ZDBGet) {
        return await this._get(options.name);
    }

    async delete(options: ZDBDelete) {
        return await this._delete(options.name);
    }

    async update(options: ZDBS) {
        if (!this.exists(options.name)) {
            throw Error(`There is no zdb deployment with name: ${options.name}`);
        }
        const oldDeployments = await this._get(options.name);
        const twinDeployments = this._createDeployment(options);
        return await this._update(this.zdb, options.name, oldDeployments, twinDeployments);
    }

    async add_zdb(options: AddZDB) {
        if (!this.exists(options.deployment_name)) {
            throw Error(`There is no zdb deployment with name: ${options.deployment_name}`);
        }
        const oldDeployments = await this._get(options.deployment_name);
        const twinDeployment = this.zdb.create(
            options.name,
            options.node_id,
            options.namespace,
            options.disk_size,
            options.disk_type,
            options.mode,
            options.password,
            options.public,
            oldDeployments[0].metadata,
            oldDeployments[0].metadata,
        );

        return await this._add(options.deployment_name, options.node_id, oldDeployments, [twinDeployment]);
    }

    async delete_zdb(options: DeleteZDB) {
        if (!this.exists(options.deployment_name)) {
            throw Error(`There is no zdb deployment with name: ${options.deployment_name}`);
        }
        return await this._deleteInstance(this.zdb, options.deployment_name, options.name);
    }
}

export { Zdbs };
