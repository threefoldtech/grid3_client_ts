declare class Graphql {
    url: string;
    constructor(url: string);
    getItemTotalCount(itemName: string, options?: string): Promise<number>;
    query(body: string, variables?: Record<string, unknown>): Promise<Record<string, unknown>>;
}
export { Graphql };
//# sourceMappingURL=client.d.ts.map