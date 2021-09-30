const axios = require('axios')

import { MessageBusClientInterface } from "./clientInterface"

class HTTPMessageBusClient implements MessageBusClientInterface {
    client: any;

    prepare(command, destination, expiration, retry) {
        return {
            "ver": 1,
            "uid": "",
            "cmd": command,
            "exp": expiration,
            "dat": "",
            "src": 0,
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

        await axios.post(`https://rmbproxy1.devnet.grid.tf/twin/${dst}`, body)
            .then(res => {
                console.log(`the send api response: ${res.status}`);
                return res.json()
            })
            .catch(error => {
                // console.log(error);
                throw new Error(error.response.data);
            })
    }

    async read(message) {
        const dst = message.dst[0]
        const retqueue = message.ret
        if (!retqueue) {
            throw new Error('The Message retqueue is null');
        }


        axios.post(`https://rmbproxy1.devnet.grid.tf/twin/${dst}/${retqueue}`)
            .then(res => {
                console.log(`the read api response for retqueue ( ${retqueue} ) is : ${res.status}`);
                return res.json()
            })
            .catch(error => {
                throw new Error(error.response.data);
            })
    }
}


export { HTTPMessageBusClient }