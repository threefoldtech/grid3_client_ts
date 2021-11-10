import { BaseModule } from "./base";
import {
    GatewayFQDNModel,
    GatewayNameModel,
    GatewayFQDNGetModel,
    GatewayFQDNDeleteModel,
    GatewayNameGetModel,
    GatewayNameDeleteModel,
} from "./models";
import { GatewayHL } from "../high_level/gateway";
import { WorkloadTypes } from "../zos/workload";
import { GatewayFQDNProxy, GatewayResult } from "../zos/gateway";

import { expose } from "../helpers/expose";
import { GridClientConfig } from "../config";

class GWModule extends BaseModule {
    fileName = "gateway.json";
    workloadTypes = [WorkloadTypes.gatewayfqdnproxy, WorkloadTypes.gatewaynameproxy];
    gateway: GatewayHL;

    constructor(config: GridClientConfig) {
        super(config);
        this.gateway = new GatewayHL(config);
    }

    @expose
    async deploy_fqdn(options: GatewayFQDNModel) {
        if (await this.exists(options.name)) {
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
        await this.save(options.name, contracts);
        return { contracts: contracts };
    }

    @expose
    async deploy_name(options: GatewayNameModel) {
        if (await this.exists(options.name)) {
            throw Error(`Another gateway deployment with the same name ${options.name} is already exist`);
        }
        const twinDeployments = await this.gateway.create(
            options.name,
            options.node_id,
            options.tls_passthrough,
            options.backends,
        );
        const contracts = await this.twinDeploymentHandler.handle(twinDeployments);
        await this.save(options.name, contracts);
        return { contracts: contracts };
    }

    @expose
    async get_fqdn(options: GatewayFQDNGetModel) {
        return await this._get(options.name);
    }

    @expose
    async delete_fqdn(options: GatewayFQDNDeleteModel) {
        return await this._delete(options.name);
    }

    @expose
    async get_name(options: GatewayNameGetModel) {
        return await this._get(options.name);
    }

    @expose
    async delete_name(options: GatewayNameDeleteModel) {
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
