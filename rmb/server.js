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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.MessageBusServer = void 0;
var redis = require("redis");
var MessageBusServer = /** @class */ (function () {
    function MessageBusServer(port) {
        var client = redis.createClient(port);
        client.on("error", function (error) {
            console.error(error);
        });
        this.client = client;
        this.handlers = new Map();
    }
    MessageBusServer.prototype.withHandler = function (topic, handler) {
        this.handlers.set("msgbus." + topic, handler);
    };
    MessageBusServer.prototype.run = function () {
        console.log("[+] waiting for request");
        var channels = Array.from(this.handlers.keys());
        channels.forEach(function (ch) {
            console.log("[+] watching " + ch);
        });
        channels.push(0);
        var _this = this;
        this.client.blpop(channels, function (err, response) {
            return __awaiter(this, void 0, void 0, function () {
                var channel, request, parsedRequest, payload, handler, data, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (err)
                                console.log(err);
                            channel = response[0], request = response[1];
                            if (!_this.handlers.has(channel)) {
                                console.log("handler " + channel + " is not initialized, skipping");
                                return [2 /*return*/];
                            }
                            parsedRequest = JSON.parse(request);
                            payload = Buffer.from(parsedRequest.dat, 'base64').toString('ascii');
                            handler = _this.handlers.get(channel);
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, handler(parsedRequest, payload)];
                        case 2:
                            data = _a.sent();
                            console.log("data from handler: " + data);
                            _this.reply(parsedRequest, data);
                            return [3 /*break*/, 4];
                        case 3:
                            error_1 = _a.sent();
                            _this.error(parsedRequest, error_1);
                            return [3 /*break*/, 4];
                        case 4:
                            _this.run();
                            return [2 /*return*/];
                    }
                });
            });
        });
    };
    MessageBusServer.prototype.reply = function (message, payload) {
        var source = message.src;
        message.dat = Buffer.from(JSON.stringify(payload)).toString('base64');
        message.src = message.dst[0];
        message.dst = [source];
        message.now = Math.floor(new Date().getTime() / 1000);
        this.client.lpush(message.ret, JSON.stringify(message), function (err, r) {
            console.log("[+] response sent to caller");
            console.log(err, r);
        });
    };
    MessageBusServer.prototype.error = function (message, reason) {
        console.log("[-] replying error: " + reason);
        message.dat = "";
        message.src = message.dst[0];
        message.dst = [message.src];
        message.now = Math.floor(new Date().getTime() / 1000);
        message.err = reason;
        this.client.lpush(message.ret, JSON.stringify(message), function (err, r) {
            if (err) {
                console.log(err, r);
                return;
            }
            console.log("[+] error response sent to caller");
        });
    };
    return MessageBusServer;
}());
exports.MessageBusServer = MessageBusServer;
