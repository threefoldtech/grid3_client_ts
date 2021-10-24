import { BaseModule } from "./base";
import { DeployGatewayFQDNModel, DeployGatewayNameModel } from "./models";
import { GatewayHL } from "../high_level/gateway";
import { MessageBusClientInterface } from "ts-rmb-client-base";
import { WorkloadTypes } from "../zos/workload";

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
        projectName: string = ""
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
}

export { GWModule };
