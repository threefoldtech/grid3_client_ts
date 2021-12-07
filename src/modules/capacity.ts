import { expose } from "../helpers/expose";
import { GridClientConfig } from "../config";
import { validateInput } from "../helpers/validator";
import { Nodes, FilterOptions } from "../primitives/nodes";
import { FarmsGetModel, NodesGetModel } from "./models";


class Capacity {
    nodes: Nodes;
    constructor(config: GridClientConfig) {
        this.nodes = new Nodes(config.graphqlURL, config.rmbClient["proxyURL"]);
    }
    @expose
    @validateInput
    async getFarms(options?: FarmsGetModel) {
        return await this.nodes.getFarms(options.page, options.max_result);
    }

    @expose
    @validateInput
    async getNodes(options?: NodesGetModel) {
        return await this.nodes.getNodes(options.page, options.max_result);
    }

    @expose
    async getAllFarms() {
        return await this.nodes.getAllFarms();
    }

    @expose
    async getAllNodes() {
        return await this.nodes.getAllNodes();
    }

    @expose
    @validateInput
    async filterNodes(options?: FilterOptions) {
        return await this.nodes.filterNodes(options);
    }
}

export { Capacity as capacity };
