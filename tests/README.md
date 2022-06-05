# Tests

## Configure

- Set your grid3 client configuration in `config.json`

```json
{
    "network": "dev", // dev, qa or test  -> 
    "mnemonic": "", 
    "rmb_proxy": true,
    "storeSecret": "secret",
    "ssh_key": ""
}
```

> Please note you can leave its content empty and export everything as environment variables

```bash
export NETWORK="dev"
export MNEMONIC=""
export RMB_PROXY="true"
export STORE_SECRET="secret"
export SSH_KEY=""
```

## Run

```bash
npm run test
```

or

```bash
yarn test
```

> **Note:** `--coverage` can be added to the running command to generate test coverage.
