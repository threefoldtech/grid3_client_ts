var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { WorkloadTypes } from "../zos/workload";
import { BaseModule } from "./base";
import { Network } from "../primitives/network";
import { VirtualMachine } from "../high_level/machine";
class Machine extends BaseModule {
    constructor(twin_id, url, mnemonic, rmbClient) {
        super(twin_id, url, mnemonic, rmbClient);
        this.twin_id = twin_id;
        this.url = url;
        this.mnemonic = mnemonic;
        this.rmbClient = rmbClient;
        this.fileName = "machines.json";
        this.vm = new VirtualMachine(twin_id, url, mnemonic, rmbClient);
    }
    deploy(options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.exists(options.name)) {
                throw Error(`Another machine deployment with the same name ${options.name} is already exist`);
            }
            const networkName = options.network.name;
            const network = new Network(networkName, options.network.ip_range, this.rmbClient);
            yield network.load(true);
            const [twinDeployments, wgConfig] = yield this.vm.create(options.name, options.node_id, options.flist, options.cpu, options.memory, options.rootfs_size, options.disks, options.public_ip, options.planetary, network, options.entrypoint, options.env, options.metadata, options.description);
            const contracts = yield this.twinDeploymentHandler.handle(twinDeployments);
            this.save(options.name, contracts, wgConfig);
            return { contracts: contracts, wireguard_config: wgConfig };
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
                throw Error(`There is no machine with name: ${options.name}`);
            }
            if (!this._getDeploymentNodeIds(options.name).includes(options.node_id)) {
                throw Error("node_id can't be changed");
            }
            const deploymentObj = (yield this._get(options.name)).pop();
            const oldDeployment = this.deploymentFactory.fromObj(deploymentObj);
            for (const workload of oldDeployment.workloads) {
                if (workload.type !== WorkloadTypes.network) {
                    continue;
                }
                if (workload.name !== options.network.name) {
                    throw Error("Network name can't be changed");
                }
            }
            const networkName = options.network.name;
            const network = new Network(networkName, options.network.ip_range, this.rmbClient);
            yield network.load(true);
            const twinDeployment = yield this.vm.update(oldDeployment, options.name, options.node_id, options.flist, options.cpu, options.memory, options.rootfs_size, options.disks, options.public_ip, options.planetary, network, options.entrypoint, options.env, options.metadata, options.description);
            console.log(JSON.stringify(twinDeployment));
            const contracts = yield this.twinDeploymentHandler.handle([twinDeployment]);
            return { contracts: contracts };
        });
    }
}
export { Machine };
