"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QSFSZdbsModule = void 0;
const base_1 = require("./base");
const zdb_1 = require("../high_level/zdb");
const zdb_2 = require("../zos/zdb");
const workload_1 = require("../zos/workload");
const qsfs_1 = require("../zos/qsfs");
class QSFSZdbsModule extends base_1.BaseModule {
    twin_id;
    url;
    mnemonic;
    rmbClient;
    storePath;
    fileName = "qsfs_zdbs.json";
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
            const twinDeployment = this.zdb.create(options.name + i, nodeId, options.disk_size, mode, options.password, true, options.metadata, options.description);
            twinDeployments.push(twinDeployment);
        }
        return twinDeployments;
    }
    async deploy(options) {
        if (this.exists(options.name)) {
            throw Error(`Another QSFS zdbs deployment with the same name ${options.name} is already exist`);
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
    async getZdbs(name) {
        const deployments = await this._get(name);
        const zdbs = [];
        for (const deployment of deployments) {
            for (const workload of deployment.workloads) {
                if (workload.type !== workload_1.WorkloadTypes.zdb) {
                    continue;
                }
                zdbs.push(workload);
            }
        }
        const qsfsZdbs = { meta: [], groups: [] };
        for (const zdb of zdbs) {
            const zdbBackend = new qsfs_1.ZdbBackend();
            zdbBackend.namespace = zdb.result.data.Namespace;
            zdbBackend.password = zdb.data.password;
            zdbBackend.address = `[${zdb.result.data.IPs[1]}]:${zdb.result.data.Port}`;
            if (zdb.data.mode === zdb_2.ZdbModes.user) {
                qsfsZdbs.meta.push(zdbBackend);
            }
            else {
                qsfsZdbs.groups.push(zdbBackend);
            }
        }
        return qsfsZdbs;
    }
}
exports.QSFSZdbsModule = QSFSZdbsModule;
