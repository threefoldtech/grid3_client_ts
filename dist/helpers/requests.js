import { default as axios } from "axios";
async function send(method, url, body, headers) {
    const options = {
        method: method,
        url: url,
        data: body,
        headers: headers,
    };
    const response = await axios(options);
    if (response.status !== 200) {
        throw Error(`http request failed with status code: ${response.status} due to: ${response.data}`);
    }
    return response.data;
}
export { send };
