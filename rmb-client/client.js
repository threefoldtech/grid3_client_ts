"use strict";
exports.__esModule = true;
exports.MessageBusClient = void 0;
var redis = require("redis");
var uuid4 = require("uuid4");
var MessageBusClient = /** @class */ (function () {
    function MessageBusClient(port) {
        var client = redis.createClient(port);
        client.on("error", function (error) {
            console.error(error);
        });
        this.client = client;
    }
    MessageBusClient.prototype.prepare = function (command, destination, expiration, retry) {
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
            "err": ""
        };
    };
    MessageBusClient.prototype.send = function (message, payload) {
        var buffer = new Buffer(payload);
        message.dat = buffer.toString("base64");
        var request = JSON.stringify(message);
        this.client.lpush(["msgbus.system.local", request], redis.print);
        console.log(request);
    };
    MessageBusClient.prototype.read = function (message, cb) {
        console.log("waiting reply", message.ret);
        var responses = [];
        var _this = this;
        this.client.blpop(message.ret, 0, function (err, reply) {
            if (err) {
                console.log("err while waiting for reply: " + err);
                return err;
            }
            var response = JSON.parse(reply[1]);
            response["dat"] = Buffer.from(response["dat"], 'base64').toString('ascii');
            responses.push(response);
            // checking if we have all responses
            if (responses.length == message.dst.length) {
                return cb(responses);
            }
            // wait for remaining responses
            _this.read(message, cb);
        });
    };
    return MessageBusClient;
}());
exports.MessageBusClient = MessageBusClient;
