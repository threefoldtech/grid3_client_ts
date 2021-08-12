const redis = require("redis")
const uuid4 = require("uuid4")

class MessageBusClient {
    client: any;
    constructor(port) {
        const client = redis.createClient(port)
        client.on("error", function (error) {
            console.error(error);
        })

        this.client = client;
    }

    prepare(command, destination, expiration, retry) {
        return {
            "ver": 1,
            "uid": "",
            "cmd": command,
            "exp": expiration,
            "dat": "",
            "src": 0,
            "dst": destination,
            "ret": uuid4(),
            "try": retry,
            "shm": "",
            "now": Math.floor(new Date().getTime() / 1000),
            "err": "",
        }
    }

    send(message, payload) {
        const buffer = new Buffer(payload);
        message.dat = buffer.toString("base64");
        const request = JSON.stringify(message)

        this.client.lpush(["msgbus.system.local", request], redis.print)
        console.log(request)
    }

    read(message, cb) {
        console.log("waiting reply", message.ret)

        const responses = []
        const _this = this
        this.client.blpop(message.ret, 0, function (err, reply) {
            if (err) {
                console.log(`err while waiting for reply: ${err}`)
                return err
            }

            const response = JSON.parse(reply[1])

            response["dat"] = Buffer.from(response["dat"], 'base64').toString('ascii')
            responses.push(response)

            // checking if we have all responses
            if (responses.length == message.dst.length) {
                return cb(responses);
            }

            // wait for remaining responses
            _this.read(message, cb)
        })
    }
}

// class MessageBusServer {
//     constructor(port) {
//         const client = redis.createClient(port)
//         client.on("error", function (error) {
//             console.error(error)
//         })

//         this.client = client
//         this.handlers = new Map()
//     }

//     withHandler(topic, handler) {
//         this.handlers.set(`msgbus.${topic}`, handler)
//     }

//     run() {
//         console.log("[+] waiting for request")

//         const channels = Array.from(this.handlers.keys())
//         channels.forEach(ch => {
//             console.log(`[+] watching ${ch}`)
//         })

//         channels.push(0)

//         const _this = this
//         this.client.blpop(channels, async function (err, response) {
//             if (err) console.log(err)

//             const [channel, request] = response

//             if (!_this.handlers.has(channel)) {
//                 console.log(`handler ${channel} is not initialised, skipping`)
//                 return
//             }

//             const parsedRequest = JSON.parse(request)
//             const payload = Buffer.from(parsedRequest.dat, 'base64').toString('ascii')

//             const handler = _this.handlers.get(channel)

//             try {
//                 const data = await handler(parsedRequest, payload)
//                 console.log(`data from handler: ${data}`)
//                 _this.reply(parsedRequest, data)
//             } catch (error) {
//                 _this.error(parsedRequest, error)
//             }

//             _this.run()
//         })
//     }

//     reply(message, payload) {
//         const source = message.src

//         message.dat = Buffer.from(JSON.stringify(payload)).toString('base64')
//         message.src = message.dst[0]
//         message.dst = [source]
//         message.now = Math.floor(new Date().getTime() / 1000)

//         this.client.lpush(message.ret, JSON.stringify(message), function (err, r) {
//             console.log("[+] response sent to caller")
//             console.log(err, r)
//         })
//     }

//     error(message, reason) {
//         console.log("[-] replying error: " + reason)

//         message.dat = ""
//         message.src = message.dst[0]
//         message.dst = [message.src]
//         message.now = Math.floor(new Date().getTime() / 1000)
//         message.err = reason

//         this.client.lpush(message.ret, JSON.stringify(message), function (err, r) {
//             if (err) {
//                 console.log(err, r)
//                 return
//             }
//             console.log("[+] error response sent to caller")
//         })
//     }
// }

export {
    MessageBusClient,
    // MessageBusServer
}