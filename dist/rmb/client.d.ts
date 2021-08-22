declare class MessageBusClient {
    client: any;
    constructor(port: any);
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
    send(message: any, payload: any): void;
    read(message: any, cb: any): void;
}
export { MessageBusClient };
