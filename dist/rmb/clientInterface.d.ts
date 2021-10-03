interface MessageBusClientInterface {
    client: any;
    prepare(command: string, destination: string, expiration: number, retry: number): object;
    send(message: object, payload: object): object;
    read(message: object): object;
}
export { MessageBusClientInterface };
