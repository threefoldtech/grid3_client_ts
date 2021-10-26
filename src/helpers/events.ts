import { EventEmitter } from "events";

const events = new EventEmitter();

function logsHandler(msg) {
    console.log(msg);
}

events.addListener("logs", logsHandler);

export { events };
