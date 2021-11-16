import { inspect } from "util";

function log(message) {
    console.log(inspect(message, { showHidden: false, depth: null, colors: true }));
}
export { log };
