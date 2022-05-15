var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { send } from "../../helpers/requests";
const HEADERS = { "Content-Type": "application/json" };
class Graphql {
    constructor(url) {
        this.url = url;
    }
    getItemTotalCount(itemName, options = "") {
        return __awaiter(this, void 0, void 0, function* () {
            const countBody = `query { items: ${itemName}Connection${options} { count: totalCount } }`;
            const countResponse = yield send("post", this.url, JSON.stringify({ query: countBody }), HEADERS);
            return countResponse["data"]["items"]["count"];
        });
    }
    query(body, variables = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield send("post", this.url, JSON.stringify({ query: body, variables: variables }), HEADERS);
            return response;
        });
    }
}
export { Graphql };
