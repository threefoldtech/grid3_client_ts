# twin_server

## Prerequisites

- [RMB server](https://github.com/threefoldtech/rmb) should be installed and running

## Configuration

Add substrate url and account's mnemonics in `config.json` in this repo home directory before running the server. [see](./test_setup.md#create-twin)

```json
{
    "url": "<substrate url>",
    "mnemonic": "<your account mnemonics>",
    "twin_id": "<your twin id created on substrate>",
    "rmb_proxy": "<RMB proxy url>" // in case http rmb proxy needs to be used
}
```

## Running

```bash
npm run server
```

or

```bash
yarn run server
```

## Usage

This is an example of getting a twin.
Put the following content in a file `test_twin.ts` in this repo home directory

```ts
import { MessageBusClient } from "ts-rmb-redis-client"
import { default as config } from "./config.json";

async function main() {
    const cmd = "twinserver.twins.get"
    const payload = JSON.stringify({ 'id': 1 })
    const rmb = new MessageBusClient();
    const msg = rmb.prepare(cmd, [config.twin_id], 0, 2);
    const message = await rmb.send(msg, payload);
    const result = await rmb.read(message)
    console.log(result)
}
main()
```

And then run this file by `yarn run ts-node test_twin.ts`

see more examples in [modules](./module.md)
