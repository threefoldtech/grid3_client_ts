## How to run the scripts

- In the repo dir, run `yarn` and `yarn build` to get the latest build
- Set your grid3 client configuration in `scripts/clientLoader.ts` or easily use one of `devnetConfig.json` or `testnetConfig.jsin`
    - If you remove the `proxy` field, you have to run redis msgbus to use.
- update your customized deployments specs
- Run using `ts-node` tool ([help link](https://www.npmjs.com/ts-node))
> to install it globally `npm i -g ts-node`

```bash
ts-node --project tsconfig-node.json scripts/zdb.ts
```
