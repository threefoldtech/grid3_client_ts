"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RMB = void 0;
const events_1 = require("../../helpers/events");
class RMB {
    client;
    constructor(rmbClient) {
        this.client = rmbClient;
    }
    async request(destTwinIds, cmd, payload, expiration = 0, retires = 3) {
        let result;
        try {
            const msg = this.client.prepare(cmd, destTwinIds, expiration, retires);
            const message = await this.client.send(msg, payload);
            result = await this.client.read(message);
            if (!result[0]) {
                throw Error(`Failed to get the response from twinId: ${destTwinIds} for command: ${cmd}`);
            }
            if (result[0].err) {
                throw Error(`Failed to apply command: ${cmd} on twinId: ${destTwinIds} due to ${String(result[0].err)}`);
            }
        }
        catch (e) {
            events_1.events.emit("logs", `Failed to send request to twinId ${destTwinIds} with command: ${cmd}, payload: ${payload} after ${retires} retries due to ${e}`);
            throw Error(e);
        }
        if (result[0].dat) {
            return JSON.parse(String(result[0].dat));
        }
        return result[0].dat;
    }
}
exports.RMB = RMB;
