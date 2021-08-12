"use strict";
exports.__esModule = true;
exports.callback = void 0;
function callback(res) {
    if (res instanceof Error) {
        console.log(res);
        process.exit(1);
    }
    var _a = res.events, events = _a === void 0 ? [] : _a, status = res.status;
    console.log("Current status is " + status.type);
    if (status.isFinalized) {
        console.log("Transaction included at blockHash " + status.asFinalized);
        // Loop through Vec<EventRecord> to display all events
        events.forEach(function (_a) {
            var phase = _a.phase, _b = _a.event, data = _b.data, method = _b.method, section = _b.section;
            console.log("\t' " + phase + ": " + section + "." + method + ":: " + data);
        });
    }
}
exports.callback = callback;
