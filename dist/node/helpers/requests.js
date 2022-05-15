"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.send = void 0;
const axios_1 = __importDefault(require("axios"));
async function send(method, url, body, headers) {
    const options = {
        method: method,
        url: url,
        data: body,
        headers: headers,
    };
    const response = await (0, axios_1.default)(options);
    if (response.status >= 400) {
        throw Error(`HTTP request failed with status code: ${response.status} due to: ${response.data}`);
    }
    return response.data;
}
exports.send = send;
