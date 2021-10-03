import { MessageBusClientInterface } from "./clientInterface";
declare class HTTPMessageBusClient implements MessageBusClientInterface {
    client: any;
    proxyURL: string;
    constructor(proxyURL: string);
    prepare(command: any, destination: any, expiration: any, retry: any): {
        ver: number;
        uid: string;
        cmd: any;
        exp: any;
        dat: string;
        src: any;
        dst: any;
        ret: any;
        try: any;
        shm: string;
        now: number;
        err: string;
    };
    send(message: any, payload: any): Promise<any>;
    read(message: any): Promise<any>;
}
export { HTTPMessageBusClient };
