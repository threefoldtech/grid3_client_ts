"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.events = void 0;
const events_1 = require("events");
const events = new events_1.EventEmitter();
exports.events = events;
function logsHandler(msg) {
    console.log(msg);
}
events.addListener("logs", logsHandler);
