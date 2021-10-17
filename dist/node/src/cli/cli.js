"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const yargs_1 = __importDefault(require("yargs"));
const helpers_1 = require("yargs/helpers");
(0, yargs_1.default)((0, helpers_1.hideBin)(process.argv))
    .command("list <type>", "List a type of solution instances", () => { }, argv => {
    console.info(`<list of ${argv.type} objects>`);
})
    .command("get <name>", "get deployment data", () => { }, argv => {
    console.info(`<get ${argv.type} object>`);
})
    .command("delete <name>", "delete deployment", () => { }, argv => {
    console.info(`<${argv.type} deleted>`);
})
    .commandDir("cmds")
    .demandCommand()
    .help()
    .parse();
// export MNEMONICS="<mnemonics workds>"
// export TWIN_ID="<your twin id>"
