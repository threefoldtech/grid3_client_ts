"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.callback = void 0;
function callback(res) {
    if (res instanceof Error) {
        console.log(res);
        process.exit(1);
    }
    const { events = [], status } = res;
    console.log(`Current status is ${status.type}`);
    if (status.isFinalized) {
        console.log(`Transaction included at blockHash ${status.asFinalized}`);
        // Loop through Vec<EventRecord> to display all events
        events.forEach(({ phase, event: { data, method, section } }) => {
            console.log(`\t' ${phase}: ${section}.${method}:: ${data}`);
        });
    }
}
exports.callback = callback;
