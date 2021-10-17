import yargs from "yargs";
import { hideBin } from "yargs/helpers";
yargs(hideBin(process.argv))
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
