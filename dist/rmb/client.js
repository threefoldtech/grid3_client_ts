"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageBusClient = void 0;
const redis = require("redis");
const uuid4 = require("uuid4");
class MessageBusClient {
    constructor(port) {
        const client = redis.createClient(port);
        client.on("error", function (error) {
            console.error(error);
        });
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
        };
    }
    send(message, payload) {
        const buffer = new Buffer(payload);
        message.dat = buffer.toString("base64");
        const request = JSON.stringify(message);
        this.client.lpush(["msgbus.system.local", request], redis.print);
        console.log(request);
    }
    read(message, cb) {
        console.log("waiting reply", message.ret);
        const responses = [];
        const _this = this;
        this.client.blpop(message.ret, 0, function (err, reply) {
            if (err) {
                console.log(`err while waiting for reply: ${err}`);
                return err;
            }
            const response = JSON.parse(reply[1]);
            response["dat"] = Buffer.from(response["dat"], 'base64').toString('ascii');
            responses.push(response);
            // checking if we have all responses
            if (responses.length == message.dst.length) {
                return cb(responses);
            }
            // wait for remaining responses
            _this.read(message, cb);
        });
    }
}
exports.MessageBusClient = MessageBusClient;
