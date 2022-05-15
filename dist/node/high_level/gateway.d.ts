import { HighLevelBase } from "./base";
import { TwinDeployment } from "./models";
declare class GatewayHL extends HighLevelBase {
    create(name: string, node_id: number, tls_passthrough: boolean, backends: string[], fqdn?: string, metadata?: string, description?: string): Promise<TwinDeployment[]>;
}
export { GatewayHL };
//# sourceMappingURL=gateway.d.ts.map