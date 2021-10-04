import * as request from "request-promise-native";

async function send(method: string, url: string, body: string, headers: Record<string, string>) {
    const options = {
        uri: url,
        body: body,
        headers: headers,
    };
    return await request[method](options);
}
export { send };
