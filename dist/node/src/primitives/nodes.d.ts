declare class Nodes {
    url: string;
    graphqlURL: string;
    constructor(url: string);
    getNodeTwinId(node_id: number): Promise<number>;
    getAccessNodes(): Promise<Record<string, unknown>>;
    getNodeIdFromContractId(contractId: number, mnemonic: string): Promise<number>;
}
export { Nodes };
//# sourceMappingURL=nodes.d.ts.map