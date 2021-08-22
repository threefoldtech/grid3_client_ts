declare class MessageBusServer {
    client: any;
    handlers: any;
    constructor(port: any);
    withHandler(topic: any, handler: any): void;
    run(): void;
    reply(message: any, payload: any): void;
    error(message: any, reason: any): void;
}
export { MessageBusServer };
