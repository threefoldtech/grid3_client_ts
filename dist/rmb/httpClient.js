"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HTTPMessageBusClient = void 0;
const axios = require('axios');
class HTTPMessageBusClient {
    constructor(proxyURL) {
        this.proxyURL = proxyURL;
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
            "ret": null,
            "try": retry,
            "shm": "",
            "now": Math.floor(new Date().getTime() / 1000),
            "err": "",
        };
    }
    send(message, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const buffer = new Buffer(payload);
            message.dat = buffer.toString("base64");
            if (message.dst.length > 1) {
                throw new Error('Http client does not support multi destinations');
            }
            const body = JSON.stringify(message);
            const dst = message.dst[0];
            yield axios.post(`${this.proxyURL}/twin/${dst}`, body)
                .then(res => {
                console.log(`the send api response: ${res.status}`);
                return res.json();
            })
                .catch(error => {
                // console.log(error);
                throw new Error(error.response.data);
            });
        });
    }
    read(message) {
        return __awaiter(this, void 0, void 0, function* () {
            const dst = message.dst[0];
            const retqueue = message.ret;
            if (!retqueue) {
                throw new Error('The Message retqueue is null');
            }
            axios.post(`${this.proxyURL}/twin/${dst}/${retqueue}`)
                .then(res => {
                console.log(`the read api response for retqueue ( ${retqueue} ) is : ${res.status}`);
                return res.json();
            })
                .catch(error => {
                throw new Error(error.response.data);
            });
        });
    }
}
exports.HTTPMessageBusClient = HTTPMessageBusClient;
