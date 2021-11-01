## How to run the scripts

- Set your grid3 client configuration in `scripts/client_loader.ts` or easily use one of `devnet_config.json` or `testnet_config.json`
    - If you remove the `proxy` field, you have to run redis msgbus to use.
- update your customized deployments specs
- Run using `ts-node` tool ([help link](https://www.npmjs.com/ts-node))
> to install it globally `npm i -g ts-node`

```bash
ts-node --project tsconfig-node.json scripts/zdb.ts
```
