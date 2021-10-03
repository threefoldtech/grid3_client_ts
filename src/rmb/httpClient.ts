const axios = require('axios')

import { MessageBusClientInterface } from "./clientInterface"

class HTTPMessageBusClient implements MessageBusClientInterface {
    client: any;
    proxyURL: string;
    constructor(proxyURL: string) {
        this.proxyURL = proxyURL;
    }

    prepare(command, destination, expiration, retry) {
        return {
            "ver": 1,
            "uid": "",
            "cmd": command,
            "exp": expiration,
            "dat": "",
            "src": destination[0] || 0,
            "dst": destination,
            "ret": null,
            "try": retry,
            "shm": "",
            "now": Math.floor(new Date().getTime() / 1000),
            "err": "",
        }
    }

    async send(message, payload) {
        const buffer = new Buffer(payload);
        message.dat = buffer.toString("base64");

        if (message.dst.length > 1) {
            throw new Error('Http client does not support multi destinations');
        }

        const body = JSON.stringify(message)
        const dst = message.dst[0]
        const sendURL = `${this.proxyURL}/twin/${dst}`
        let msgIdentifier;

        console.log(`The request URL is : ${sendURL}`)
        await axios.post(sendURL, body)
            .then(res => {
                console.log(`the send api response: ${res.status}`);
                console.log(res.data);
                msgIdentifier = res.data
            })
            .catch(error => {
                if (error.response) {
                    console.log(error.response.data);
                }
                throw new Error(error.message);
            })
        message.ret = msgIdentifier.retqueue;
        return message;
    }

    async read(message) {
        const dst = message.dst[0]
        const retqueue = message.ret
        let ret;
        if (!retqueue) {
            throw new Error('The Message retqueue is null');
        }


        await axios.post(`${this.proxyURL}/twin/${dst}/${retqueue}`)
            .then(res => {
                console.log(`the read api response for retqueue ( ${retqueue} ) is : ${res.status}`);
                ret = res.data
            })
            .catch(error => {
                throw new Error(error.message);
            })
        return ret;
    }
}


export { HTTPMessageBusClient }