"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZdbsModule = void 0;
const base_1 = require("./base");
const zdb_1 = require("../high_level/zdb");
const workload_1 = require("../zos/workload");
class ZdbsModule extends base_1.BaseModule {
    twin_id;
    url;
    mnemonic;
    rmbClient;
    storePath;
    fileName = "zdbs.json";
    workloadTypes = [workload_1.WorkloadTypes.zdb];
    zdb;
    constructor(twin_id, url, mnemonic, rmbClient, storePath, projectName = "") {
        super(twin_id, url, mnemonic, rmbClient, storePath, projectName);
        this.twin_id = twin_id;
        this.url = url;
        this.mnemonic = mnemonic;
        this.rmbClient = rmbClient;
        this.storePath = storePath;
        this.zdb = new zdb_1.ZdbHL(twin_id, url, mnemonic, rmbClient, this.storePath);
    }
    _createDeployment(options) {
        const twinDeployments = [];
        for (const instance of options.zdbs) {
            const twinDeployment = this.zdb.create(instance.name, instance.node_id, instance.namespace, instance.disk_size, instance.disk_type, instance.mode, instance.password, instance.public, options.metadata, options.description);
            twinDeployments.push(twinDeployment);
        }
        return twinDeployments;
    }
    async deploy(options) {
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
    async get(options) {
        return await this._get(options.name);
    }
    async delete(options) {
        return await this._delete(options.name);
    }
    async update(options) {
        if (!this.exists(options.name)) {
            throw Error(`There is no zdb deployment with name: ${options.name}`);
        }
        const oldDeployments = await this._get(options.name);
        const twinDeployments = this._createDeployment(options);
        return await this._update(this.zdb, options.name, oldDeployments, twinDeployments);
    }
    async addZdb(options) {
        if (!this.exists(options.deployment_name)) {
            throw Error(`There is no zdb deployment with name: ${options.deployment_name}`);
        }
        const oldDeployments = await this._get(options.deployment_name);
        const twinDeployment = this.zdb.create(options.name, options.node_id, options.namespace, options.disk_size, options.disk_type, options.mode, options.password, options.public, oldDeployments[0].metadata, oldDeployments[0].metadata);
        return await this._add(options.deployment_name, options.node_id, oldDeployments, [twinDeployment]);
    }
    async deleteZdb(options) {
        if (!this.exists(options.deployment_name)) {
            throw Error(`There is no zdb deployment with name: ${options.deployment_name}`);
        }
        return await this._deleteInstance(this.zdb, options.deployment_name, options.name);
    }
}
exports.ZdbsModule = ZdbsModule;
