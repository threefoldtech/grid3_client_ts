import { GridClientConfig } from "../config";
import { FarmInfo, NodeInfo, NodeResources, Nodes } from "../primitives/nodes";
import { FarmHasFreePublicIPsModel, FarmIdFromFarmNameModel, FarmsGetModel, FilterOptions, NodeFreeResourcesModel, NodesByFarmIdModel, NodesGetModel } from "./models";
declare class Capacity {
    nodes: Nodes;
    constructor(config: GridClientConfig);
    getFarms(options?: FarmsGetModel): Promise<FarmInfo[]>;
    getNodes(options?: NodesGetModel): Promise<NodeInfo[]>;
    getAllFarms(): Promise<FarmInfo[]>;
    getAllNodes(): Promise<NodeInfo[]>;
    filterNodes(options?: FilterOptions): Promise<NodeInfo[]>;
    checkFarmHasFreePublicIps(options?: FarmHasFreePublicIPsModel): Promise<boolean>;
    getNodesByFarmId(options?: NodesByFarmIdModel): Promise<NodeInfo[]>;
    getNodeFreeResources(options?: NodeFreeResourcesModel): Promise<NodeResources>;
    getFarmIdFromFarmName(options?: FarmIdFromFarmNameModel): Promise<number>;
}
export { Capacity as capacity };
//# sourceMappingURL=capacity.d.ts.map