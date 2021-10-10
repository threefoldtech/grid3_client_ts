import { BaseModule } from "./base";
import { DeployGatewayFQDN, DeployGatewayName } from "./models";
import { GatewayHL } from "../high_level/gateway";
import { MessageBusClientInterface } from "ts-rmb-client-base";
declare class Gateway extends BaseModule {
    twin_id: number;
    url: string;
    mnemonic: string;
    rmbClient: MessageBusClientInterface;
    fileName: string;
    gateway: GatewayHL;
    constructor(twin_id: number, url: string, mnemonic: string, rmbClient: MessageBusClientInterface);
    deploy_fqdn(options: DeployGatewayFQDN): Promise<{
        contracts: {
            created: any[];
            updated: any[];
            deleted: any[];
        };
    }>;
    deploy_name(options: DeployGatewayName): Promise<{
        contracts: {
            created: any[];
            updated: any[];
            deleted: any[];
        };
    }>;
}
export { Gateway };
//# sourceMappingURL=gateway.d.ts.map