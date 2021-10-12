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
class ZdbsModule extends BaseModule {
    constructor(twin_id, url, mnemonic, rmbClient) {
        super(twin_id, url, mnemonic, rmbClient);
        this.twin_id = twin_id;
        this.url = url;
        this.mnemonic = mnemonic;
        this.rmbClient = rmbClient;
        this.fileName = "zdbs.json";
        this.zdb = new ZdbHL(twin_id, url, mnemonic, rmbClient);
    }
    _createDeployment(options) {
        const twinDeployments = [];
        for (const instance of options.zdbs) {
            const twinDeployment = this.zdb.create(instance.name, instance.node_id, instance.namespace, instance.disk_size, instance.disk_type, instance.mode, instance.password, instance.public, options.metadata, options.description);
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
            const twinDeployment = this.zdb.create(options.name, options.node_id, options.namespace, options.disk_size, options.disk_type, options.mode, options.password, options.public, oldDeployments[0].metadata, oldDeployments[0].metadata);
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
