import { expose } from "../helpers/expose";
import { GridClientConfig } from "../config";
import { validateInput } from "../helpers/validator";
import { Nodes, FilterOptions, FarmInfo, NodeInfo, NodeResources } from "../primitives/nodes";
import {
    FarmsGetModel,
    NodesGetModel,
    FarmHasFreePublicIPsModel,
    NodesByFarmIdModel,
    NodeFreeResourcesModel,
    FarmIdFromFarmNameModel,
} from "./models";

class Capacity {
    nodes: Nodes;
    constructor(config: GridClientConfig) {
        this.nodes = new Nodes(config.graphqlURL, config.rmbClient["proxyURL"]);
    }
    @expose
    @validateInput
    async getFarms(options: FarmsGetModel = {}): Promise<FarmInfo[]> {
        return await this.nodes.getFarms(options.page, options.maxResult);
    }

    @expose
    @validateInput
    async getNodes(options: NodesGetModel = {}): Promise<NodeInfo[]> {
        return await this.nodes.getNodes(options.page, options.maxResult);
    }

    @expose
    async getAllFarms(): Promise<FarmInfo[]> {
        return await this.nodes.getAllFarms();
    }

    @expose
    async getAllNodes(): Promise<NodeInfo[]> {
        return await this.nodes.getAllNodes();
    }

    @expose
    @validateInput
    async filterNodes(options?: FilterOptions): Promise<NodeInfo[]> {
        return await this.nodes.filterNodes(options);
    }

    @expose
    @validateInput
    async CheckFarmHasFreePublicIps(options?: FarmHasFreePublicIPsModel): Promise<boolean> {
        return await this.nodes.CheckFarmHasFreePublicIps(options.farmId);
    }

    @expose
    @validateInput
    async getNodesByFarmId(options?: NodesByFarmIdModel): Promise<NodeInfo[]> {
        return await this.nodes.getNodesByFarmId(options.farmId);
    }

    @expose
    @validateInput
    async getNodeFreeResources(options?: NodeFreeResourcesModel): Promise<NodeResources> {
        return await this.nodes.getNodeFreeResources(options.nodeId);
    }

    @expose
    @validateInput
    async getFarmIdFromFarmName(options?: FarmIdFromFarmNameModel): Promise<number> {
        return await this.nodes.getFarmIdFromFarmName(options.farmName);
    }
}

export { Capacity as capacity };
