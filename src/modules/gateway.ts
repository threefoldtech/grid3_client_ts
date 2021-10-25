import { BaseModule } from "./base";
import { DeployGatewayFQDNModel, DeployGatewayNameModel } from "./models";
import { GatewayHL } from "../high_level/gateway";
import { WorkloadTypes } from "../zos/workload";
import { GatewayFQDNProxy, GatewayNameProxy } from "../zos/gateway";

import { MessageBusClientInterface } from "ts-rmb-client-base";

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

    async getObj(deploymentName: string) {
        const deployments = await this._get(deploymentName);
        const workloads = this._getWorkloadsByType(deployments, WorkloadTypes.gatewayfqdnproxy);
        workloads.forEach(workload => {
            const data = workload.data as GatewayFQDNProxy;
            return {
                version: workload.version,
                name: workload.name,
                created: workload.result.created,
                status: workload.result.state,
                message: workload.result.message,
                fqdn: data.fqdn,
                tls_passthrough: data.tls_passthrough,
                backends: data.backends,
                metadata: workload.metadata,
                description: workload.description,
                ...workload.result.data,
            };
        });
    }
}

export { GWModule };
