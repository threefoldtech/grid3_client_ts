import { GridClientConfig } from "../config";
import { expose } from "../helpers/expose";
import { validateInput } from "../helpers/validator";
import { FarmInfo, NodeInfo, NodeResources, Nodes } from "../primitives/nodes";
import {
    FarmHasFreePublicIPsModel,
    FarmIdFromFarmNameModel,
    FarmsGetModel,
    FilterOptions,
    NodeFreeResourcesModel,
    NodesByFarmIdModel,
    NodesGetModel,
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
    async checkFarmHasFreePublicIps(options?: FarmHasFreePublicIPsModel): Promise<boolean> {
        return await this.nodes.checkFarmHasFreePublicIps(options.farmId);
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
    @expose
    @validateInput
    async getDedicatedNodes(): Promise<any> {
        return await this.nodes.getDedicatedNodes();
    }
}

export { Capacity as capacity };
