import { send } from "../../helpers/requests";

const HEADERS = { "Content-Type": "application/json" };

class Graphql {
    constructor(public url: string) {}
    async getItemTotalCount(itemName: string, options = ""): Promise<number> {
        const countBody = `query { items: ${itemName}Connection${options} { count: totalCount } }`;
        const countResponse = await send("post", this.url, JSON.stringify({ query: countBody }), HEADERS);
        return countResponse["data"]["items"]["count"];
    }

    async query(body: string, variables: Record<string, unknown> = {}): Promise<Record<string, unknown>> {
        const response = await send("post", this.url, JSON.stringify({ query: body, variables: variables }), HEADERS);
        return response;
    }
}

export { Graphql };
