import { GridClientConfig } from "../config";
import { GatewayHL } from "../high_level/gateway";
import { WorkloadTypes } from "../zos/workload";
import { BaseModule } from "./base";
import { GatewayFQDNDeleteModel, GatewayFQDNGetModel, GatewayFQDNModel, GatewayNameDeleteModel, GatewayNameGetModel, GatewayNameModel } from "./models";
declare class GWModule extends BaseModule {
    moduleName: string;
    workloadTypes: WorkloadTypes[];
    gateway: GatewayHL;
    constructor(config: GridClientConfig);
    deploy_fqdn(options: GatewayFQDNModel): Promise<{
        contracts: {
            created: any[];
            updated: any[];
            deleted: any[];
        };
    }>;
    deploy_name(options: GatewayNameModel): Promise<{
        contracts: {
            created: any[];
            updated: any[];
            deleted: any[];
        };
    }>;
    list(): Promise<string[]>;
    get_fqdn(options: GatewayFQDNGetModel): Promise<any[]>;
    delete_fqdn(options: GatewayFQDNDeleteModel): Promise<{
        created: any[];
        deleted: any[];
        updated: any[];
    }>;
    get_name(options: GatewayNameGetModel): Promise<any[]>;
    delete_name(options: GatewayNameDeleteModel): Promise<{
        created: any[];
        deleted: any[];
        updated: any[];
    }>;
    getObj(deploymentName: string): Promise<{
        version: number;
        contractId: any;
        name: string;
        created: number;
        status: import("../zos/workload").ResultStates;
        message: string;
        type: WorkloadTypes;
        domain: string;
        tls_passthrough: boolean;
        backends: string[];
        metadata: string;
        description: string;
    }[]>;
}
export { GWModule as gateway };
//# sourceMappingURL=gateway.d.ts.map