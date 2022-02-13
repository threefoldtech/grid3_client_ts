import { MessageBusClientInterface } from "ts-rmb-client-base";

import { events } from "../../helpers/events";

class RMB {
    client: MessageBusClientInterface;
    constructor(rmbClient: MessageBusClientInterface) {
        this.client = rmbClient;
    }

    async request(destTwinIds: number[], cmd: string, payload: string, expiration = 0, retires = 3) {
        let result;
        try {
            const msg = this.client.prepare(cmd, destTwinIds, expiration, retires);
            const message = await this.client.send(msg, payload);
            result = await this.client.read(message);

            if (!result[0]) {
                throw Error(`Failed to get the response from twinId: ${destTwinIds} for command: ${cmd}`);
            }

            if (result[0].err) {
                throw Error(
                    `Failed to apply command: ${cmd} on twinId: ${destTwinIds} due to ${String(result[0].err)}`,
                );
            }
        } catch (e) {
            events.emit(
                "logs",
                `Failed to send request to twinId ${destTwinIds} with command: ${cmd}, payload: ${payload} after ${retires} retries due to ${e}`,
            );
            throw Error(e);
        }
        if (result[0].dat) {
            return JSON.parse(String(result[0].dat));
        }
        return result[0].dat;
    }
}

export { RMB };
