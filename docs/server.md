# Twin server

Twin server is a [RMB](https://github.com/threefoldtech/go-rmb) server that supports the same functionality of the grid3 client over RMB.

## Prerequisites

- [RMB server](https://github.com/threefoldtech/go-rmb) should be installed and running

## Configuration

Add substrate url and account's mnemonics in `config.json` in [server directory](../server/config.json) before running the server. [see](./test_setup.md#create-twin)

```json
{
    "network": "<network environment dev or test>",
    "mnemonic": "<your account mnemonics>",
    "rmb_proxy": false, // in case http rmb proxy needs to be used
    "storeSecret": "secret", // secret used for encrypting/decrypting the values in tfkvStore
    "keypairType": "sr25519" // keypair type for the account created on substrate
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
Put the following content in a file `test_twin.ts`

```ts
import { MessageBusClient } from "ts-rmb-redis-client"

async function main() {
    const myTwinId = 3
    const cmd = "twinserver.twins.get"
    const payload = JSON.stringify({ 'id': 1 })
    const rmb = new MessageBusClient();
    const msg = rmb.prepare(cmd, [myTwinId], 0, 2);
    const message = await rmb.send(msg, payload);
    const result = await rmb.read(message)
    console.log(result)
}
main()
```

And then run this file by `yarn run ts-node test_twin.ts`

see more examples in [modules](./module.md)
