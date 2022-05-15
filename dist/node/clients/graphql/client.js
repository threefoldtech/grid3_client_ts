"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Graphql = void 0;
const requests_1 = require("../../helpers/requests");
const HEADERS = { "Content-Type": "application/json" };
class Graphql {
    url;
    constructor(url) {
        this.url = url;
    }
    async getItemTotalCount(itemName, options = "") {
        const countBody = `query { items: ${itemName}Connection${options} { count: totalCount } }`;
        const countResponse = await (0, requests_1.send)("post", this.url, JSON.stringify({ query: countBody }), HEADERS);
        return countResponse["data"]["items"]["count"];
    }
    async query(body, variables = {}) {
        const response = await (0, requests_1.send)("post", this.url, JSON.stringify({ query: body, variables: variables }), HEADERS);
        return response;
    }
}
exports.Graphql = Graphql;
