var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { events } from "../../helpers/events";
class RMB {
    constructor(rmbClient) {
        this.client = rmbClient;
    }
    request(destTwinIds, cmd, payload, expiration = 0, retires = 3) {
        return __awaiter(this, void 0, void 0, function* () {
            let result;
            try {
                const msg = this.client.prepare(cmd, destTwinIds, expiration, retires);
                const message = yield this.client.send(msg, payload);
                result = yield this.client.read(message);
                if (!result[0]) {
                    throw Error(`Failed to get the response from twinId: ${destTwinIds} for command: ${cmd}`);
                }
                if (result[0].err) {
                    throw Error(`Failed to apply command: ${cmd} on twinId: ${destTwinIds} due to ${String(result[0].err)}`);
                }
            }
            catch (e) {
                events.emit("logs", `Failed to send request to twinId ${destTwinIds} with command: ${cmd}, payload: ${payload} after ${retires} retries due to ${e}`);
                throw Error(e);
            }
            if (result[0].dat) {
                return JSON.parse(String(result[0].dat));
            }
            return result[0].dat;
        });
    }
}
export { RMB };
