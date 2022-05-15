import { MessageBusClientInterface } from "ts-rmb-client-base";
declare class RMB {
    client: MessageBusClientInterface;
    constructor(rmbClient: MessageBusClientInterface);
    request(destTwinIds: number[], cmd: string, payload: string, expiration?: number, retires?: number): Promise<any>;
}
export { RMB };
//# sourceMappingURL=client.d.ts.map