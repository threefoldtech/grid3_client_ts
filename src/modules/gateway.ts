import { BaseModule } from "./base";
import {
    DeployGatewayFQDNModel,
    DeployGatewayNameModel,
    GatewayFQDNGetModel,
    GatewayFQDNDeleteModel,
    GatewayNameGetModel,
    GatewayNameDeleteModel,
} from "./models";
import { GatewayHL } from "../high_level/gateway";
import { WorkloadTypes } from "../zos/workload";
import { GatewayFQDNProxy, GatewayNameProxy, GatewayResult } from "../zos/gateway";

import { MessageBusClientInterface } from "ts-rmb-client-base";
import { expose } from "../helpers/expose";

class GWModule extends BaseModule {
    fileName = "gateway.json";
    workloadTypes = [WorkloadTypes.gatewayfqdnproxy, WorkloadTypes.gatewaynameproxy];
    gateway: GatewayHL;

    constructor(
        public twin_id: number,
        public url: string,
        public mnemonic: string,
        public rmbClient: MessageBusClientInterface,
        public storePath: string,
        projectName = "",
    ) {
        super(twin_id, url, mnemonic, rmbClient, storePath, projectName);
        this.gateway = new GatewayHL(twin_id, url, mnemonic, rmbClient, this.storePath);
    }

    @expose
    async deploy_fqdn(options: DeployGatewayFQDNModel) {
        if (this.exists(options.name)) {
            throw Error(`Another gateway deployment with the same name ${options.name} is already exist`);
        }
        const twinDeployments = await this.gateway.create(
            options.name,
            options.node_id,
            options.tls_passthrough,
            options.backends,
            options.fqdn,
        );
        const contracts = await this.twinDeploymentHandler.handle(twinDeployments);
        this.save(options.name, contracts);
        return { contracts: contracts };
    }

    @expose
    async deploy_name(options: DeployGatewayNameModel) {
        if (this.exists(options.name)) {
            throw Error(`Another gateway deployment with the same name ${options.name} is already exist`);
        }
        const twinDeployments = await this.gateway.create(
            options.name,
            options.node_id,
            options.tls_passthrough,
            options.backends,
        );
        const contracts = await this.twinDeploymentHandler.handle(twinDeployments);
        this.save(options.name, contracts);
        return { contracts: contracts };
    }

    async getFQDN(options: GatewayFQDNGetModel) {
        return await this._get(options.name);
    }

    async deleteFQDN(options: GatewayFQDNDeleteModel) {
        return await this._delete(options.name);
    }

    async getName(options: GatewayNameGetModel) {
        return await this._get(options.name);
    }

    async deleteName(options: GatewayNameDeleteModel) {
        return await this._delete(options.name);
    }

    async getObj(deploymentName: string): Promise<any> {
        const deployments = await this._get(deploymentName);
        const workloads = this._getWorkloadsByTypes(deployments, [
            WorkloadTypes.gatewayfqdnproxy,
            WorkloadTypes.gatewaynameproxy,
        ]);
        return workloads.map(workload => {
            const data = workload.data as GatewayFQDNProxy;
            return {
                version: workload.version,
                name: workload.name,
                created: workload.result.created,
                status: workload.result.state,
                message: workload.result.message,
                type: workload.type,
                domain:
                    workload.type === WorkloadTypes.gatewayfqdnproxy
                        ? data.fqdn
                        : (workload.result.data as GatewayResult).fqdn,
                tls_passthrough: data.tls_passthrough,
                backends: data.backends,
                metadata: workload.metadata,
                description: workload.description,
            };
        });
    }
}

export { GWModule as gateway };
