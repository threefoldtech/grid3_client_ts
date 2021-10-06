declare function getNodeTwinId(node_id: number): Promise<number>;
declare function getAccessNodes(): Promise<Record<string, unknown>>;
declare function getNodeIdFromContractId(contractId: number, url: string, mnemonic: string): Promise<number>;
export { getNodeTwinId, getAccessNodes, getNodeIdFromContractId };
//# sourceMappingURL=nodes.d.ts.map