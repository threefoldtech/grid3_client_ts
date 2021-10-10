import { BaseModule } from "./base";
import { DeployGatewayFQDN, DeployGatewayName } from "./models";
import { GatewayHL } from "../high_level/gateway";
import { MessageBusClientInterface } from "ts-rmb-client-base";


class Gateway extends BaseModule {
    fileName = "gateway.json";
    gateway: GatewayHL;

    constructor(public twin_id: number, public url: string, public mnemonic: string, public rmbClient: MessageBusClientInterface) {
        super(twin_id, url, mnemonic, rmbClient);
        this.gateway = new GatewayHL(twin_id, url, mnemonic, rmbClient);
    }

    async deploy_fqdn(options: DeployGatewayFQDN) {
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

    async deploy_name(options: DeployGatewayName) {
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

export { Gateway };