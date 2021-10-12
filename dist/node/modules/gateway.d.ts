import { BaseModule } from "./base";
import { DeployGatewayFQDNModel, DeployGatewayNameModel } from "./models";
import { GatewayHL } from "../high_level/gateway";
import { MessageBusClientInterface } from "ts-rmb-client-base";
declare class GWModule extends BaseModule {
    twin_id: number;
    url: string;
    mnemonic: string;
    rmbClient: MessageBusClientInterface;
    fileName: string;
    gateway: GatewayHL;
    constructor(twin_id: number, url: string, mnemonic: string, rmbClient: MessageBusClientInterface);
    deploy_fqdn(options: DeployGatewayFQDNModel): Promise<{
        contracts: {
            created: any[];
            updated: any[];
            deleted: any[];
        };
    }>;
    deploy_name(options: DeployGatewayNameModel): Promise<{
        contracts: {
            created: any[];
            updated: any[];
            deleted: any[];
        };
    }>;
}
export { GWModule };
//# sourceMappingURL=gateway.d.ts.map