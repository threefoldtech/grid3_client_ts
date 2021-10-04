import { DeviceTypes, ZdbModes } from "../zos/zdb";
import { Deployment } from "../zos/deployment";
import { WorkloadTypes } from "../zos/workload";

import { HighLevelBase } from "./base";
import { zdb } from "../primitives/zdb";
import { DeploymentFactory } from "../primitives/deployment";
import { TwinDeployment, Operations } from "../high_level/models";

class ZdbHL extends HighLevelBase {
    create(
        name: string,
        node_id: number,
        namespace: string,
        disk_size: number,
        disk_type: DeviceTypes,
        mode: ZdbModes,
        password: string,
        publicIpv6: boolean,
        metadata = "",
        description = "",
    ) {
        const deploymentFactory = new DeploymentFactory(this.twin_id, this.url, this.mnemonic);
        const zdbFactory = new zdb();
        const zdbWorkload = zdbFactory.create(
            name,
            namespace,
            disk_size,
            mode,
            password,
            disk_type,
            publicIpv6,
            metadata,
            description,
        );
        const deployment = deploymentFactory.create([zdbWorkload], 1626394539, metadata, description);
        return new TwinDeployment(deployment, Operations.deploy, 0, node_id);
    }
    async delete(deployment: Deployment, names: string[]) {
        return await this._delete(deployment, names, [WorkloadTypes.zdb]);
    }
}
export { ZdbHL };
