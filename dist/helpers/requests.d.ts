declare function send(method: string, url: string, body: string, headers: Record<string, string>): Promise<any>;
export { send };
