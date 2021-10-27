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
import { WorkloadTypes } from "../zos/workload";
import { ZdbHL } from "../high_level/zdb";
class ZdbsModule extends BaseModule {
    constructor(twin_id, url, mnemonic, rmbClient, storePath, projectName = "") {
        super(twin_id, url, mnemonic, rmbClient, storePath, projectName);
        this.twin_id = twin_id;
        this.url = url;
        this.mnemonic = mnemonic;
        this.rmbClient = rmbClient;
        this.storePath = storePath;
        this.fileName = "zdbs.json";
        this.workloadTypes = [WorkloadTypes.zdb];
        this.zdb = new ZdbHL(twin_id, url, mnemonic, rmbClient, this.storePath);
    }
    _createDeployment(options) {
        const twinDeployments = [];
        for (const instance of options.zdbs) {
            const twinDeployment = this.zdb.create(instance.name, instance.node_id, instance.disk_size, instance.mode, instance.password, instance.public_ipv6, options.metadata, options.description);
            twinDeployments.push(twinDeployment);
        }
        return twinDeployments;
    }
    deploy(options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.exists(options.name)) {
                throw Error(`Another zdb deployment with the same name ${options.name} is already exist`);
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
    getObj(deploymentName) {
        return __awaiter(this, void 0, void 0, function* () {
            const deployments = yield this._get(deploymentName);
            const workloads = this._getWorkloadsByType(deployments, WorkloadTypes.zdb);
            const ret = [];
            for (const workload of workloads) {
                const data = workload.data;
                ret.push({
                    version: workload.version,
                    name: workload.name,
                    created: workload.result.created,
                    status: workload.result.state,
                    message: workload.result.message,
                    size: data.size,
                    mode: data.mode,
                    public: data.public,
                    password: data.password,
                    metadata: workload.metadata,
                    description: workload.description,
                    resData: workload.result.data,
                });
            }
            return ret;
        });
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
    update(options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.exists(options.name)) {
                throw Error(`There is no zdb deployment with name: ${options.name}`);
            }
            const oldDeployments = yield this._get(options.name);
            const twinDeployments = this._createDeployment(options);
            return yield this._update(this.zdb, options.name, oldDeployments, twinDeployments);
        });
    }
    addZdb(options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.exists(options.deployment_name)) {
                throw Error(`There is no zdb deployment with name: ${options.deployment_name}`);
            }
            const oldDeployments = yield this._get(options.deployment_name);
            const twinDeployment = this.zdb.create(options.name, options.node_id, options.disk_size, options.mode, options.password, options.public_ipv6, oldDeployments[0].metadata, oldDeployments[0].metadata);
            return yield this._add(options.deployment_name, options.node_id, oldDeployments, [twinDeployment]);
        });
    }
    deleteZdb(options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.exists(options.deployment_name)) {
                throw Error(`There is no zdb deployment with name: ${options.deployment_name}`);
            }
            return yield this._deleteInstance(this.zdb, options.deployment_name, options.name);
        });
    }
}
export { ZdbsModule };
