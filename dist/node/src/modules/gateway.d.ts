import { BaseModule } from "./base";
import { DeployGatewayFQDNModel, DeployGatewayNameModel } from "./models";
import { GatewayHL } from "../high_level/gateway";
import { WorkloadTypes } from "../zos/workload";
import { MessageBusClientInterface } from "ts-rmb-client-base";
declare class GWModule extends BaseModule {
    twin_id: number;
    url: string;
    mnemonic: string;
    rmbClient: MessageBusClientInterface;
    storePath: string;
    fileName: string;
    workloadTypes: WorkloadTypes[];
    gateway: GatewayHL;
    constructor(twin_id: number, url: string, mnemonic: string, rmbClient: MessageBusClientInterface, storePath: string);
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
    getPrettyObj(deploymentName: string): Promise<void>;
}
export { GWModule };
//# sourceMappingURL=gateway.d.ts.map