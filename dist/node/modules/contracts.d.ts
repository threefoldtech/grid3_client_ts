import { TFClient } from "../clients/tf-grid/client";
import { GridClientConfig } from "../config";
import { Nodes } from "../primitives/nodes";
import { ContractCancelModel, ContractConsumption, ContractGetByNodeIdAndHashModel, ContractGetModel, ContractsByAddress, ContractsByTwinId, NameContractCreateModel, NameContractGetModel, NodeContractCreateModel, NodeContractUpdateModel } from "./models";
declare class Contracts {
    config: GridClientConfig;
    client: TFClient;
    nodes: Nodes;
    constructor(config: GridClientConfig);
    private invalidateDeployment;
    create_node(options: NodeContractCreateModel): Promise<any>;
    create_name(options: NameContractCreateModel): Promise<any>;
    get(options: ContractGetModel): Promise<any>;
    get_contract_id_by_node_id_and_hash(options: ContractGetByNodeIdAndHashModel): Promise<any>;
    get_name_contract(options: NameContractGetModel): Promise<any>;
    update_node(options: NodeContractUpdateModel): Promise<any>;
    cancel(options: ContractCancelModel): Promise<any>;
    listMyContracts(): Promise<unknown>;
    listContractsByTwinId(options: ContractsByTwinId): Promise<unknown>;
    listContractsByAddress(options: ContractsByAddress): Promise<unknown>;
    /**
     * WARNING: Please be careful when executing this method, it will delete all your contracts.
     * @returns Promise
     */
    cancelMyContracts(): Promise<Record<string, number>[]>;
    /**
     * Get contract consumption per hour in TFT.
     *
     * @param  {ContractConsumption} options
     * @returns {Promise<number>}
     */
    getConsumption(options: ContractConsumption): Promise<number>;
}
export { Contracts as contracts };
//# sourceMappingURL=contracts.d.ts.map