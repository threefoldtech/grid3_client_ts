var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { default as axios } from "axios";
function send(method, url, body, headers) {
    return __awaiter(this, void 0, void 0, function* () {
        const options = {
            method: method,
            url: url,
            data: body,
            headers: headers,
        };
        const response = yield axios(options);
        if (response.status >= 400) {
            throw Error(`HTTP request failed with status code: ${response.status} due to: ${response.data}`);
        }
        return response.data;
    });
}
export { send };
