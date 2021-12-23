import { MessageBusClientInterface } from "ts-rmb-client-base";

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

            if (result[0].err) {
                throw Error(String(result[0].err));
            }
        } catch (e) {
            throw Error(
                `Failed to send request to ${destTwinIds} with command: ${cmd}, payload: ${payload} after ${retires} retries due to ${e}`,
            );
        }
        if (result[0].dat) {
            return JSON.parse(String(result[0].dat));
        }
        return result[0].dat;
    }
}

export { RMB };
