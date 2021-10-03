import { MessageBusClientInterface } from "./clientInterface";
declare class MessageBusClient implements MessageBusClientInterface {
    client: any;
    constructor(port?: number);
    prepare(command: any, destination: any, expiration: any, retry: any): {
        ver: number;
        uid: string;
        cmd: any;
        exp: any;
        dat: string;
        src: number;
        dst: any;
        ret: any;
        try: any;
        shm: string;
        now: number;
        err: string;
    };
    send(message: any, payload: any): any;
    read(message: any): Promise<unknown>;
}
export { MessageBusClient };
