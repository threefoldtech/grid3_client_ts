import { Deployment } from "../zos/deployment";
import { Network } from "../primitives/network";
import { HighLevelBase } from "./base";
declare class Kubernetes extends HighLevelBase {
    add_master(name: string, nodeId: number, secret: string, cpu: number, memory: number, diskSize: number, publicIp: boolean, network: Network, sshKey: string, metadata?: string, description?: string): Promise<[import("./models").TwinDeployment[], string]>;
    add_worker(name: string, nodeId: number, secret: string, masterIp: string, cpu: number, memory: number, diskSize: number, publicIp: boolean, network: Network, sshKey: string, metadata?: string, description?: string): Promise<[import("./models").TwinDeployment[], string]>;
    delete(deployment: Deployment, names: string[]): Promise<import("./models").TwinDeployment[]>;
}
export { Kubernetes };
