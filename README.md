# grid3_client_ts

[![npm version](https://img.shields.io/npm/v/grid3_client.svg)](https://badge.fury.io/js/grid3_client)
[![Build](https://github.com/threefoldtech/grid3_client_ts/actions/workflows/build.yml/badge.svg)](https://github.com/threefoldtech/grid3_client_ts/actions/workflows/build.yml)
[![tests](https://github.com/threefoldtech/grid3_client_ts/actions/workflows/tests.yml/badge.svg)](https://github.com/threefoldtech/grid3_client_ts/actions/workflows/tests.yml)
[![code coverage](https://codecov.io/gh/threefoldtech/grid3_client_ts/branch/development/graph/badge.svg)](https://codecov.io/gh/threefoldtech/grid3_client_ts/branch/development)




Github repo: [grid3_client_ts](https://github.com/threefoldtech/grid3_client_ts.git)

grid3_client is a client used for deploying workloads (VMs, ZDBs, k8s, etc.) on grid3.

## Prerequisites

- node 16.13.1 or higher
- npm 8.2.0 or higher
- may need to install libtool `apt-get install libtool`

## Installation

### External package

```bash
npm install grid3_client
```

or

```bash
yarn add grid3_client
```

### Local usage

- Clone the repository

```bash
git clone https://github.com/threefoldtech/grid3_client_ts.git
```

- Install it

```bash
npm install
```

or

```bash
yarn install
```

## Getting started

### Client configuration

- Network environment: should select dev environment, qa, test or main.

    ```ts
    import { NetworkEnv } from "grid3_client";

    const network = NetworkEnv.dev
    ```

- Mnemonic: 12 words for your account. [create one](https://library.threefold.me/info/manual/#/getstarted/manual__tfchain_portal_polkadot_create_account)

- Store secret: it's any word that will be used for encrypting/decrypting the keys on threefold key-value store.

- Create RMB client

    grid 3 client supports communication over [RMB](https://github.com/threefoldtech/go-rmb) MessageBusClient or HTTP HTTPMessageBusClient using one of the deployed grid3 proxies.

    **HTTP**

    ```ts
    import { HTTPMessageBusClient } from "ts-rmb-http-client";

    const rmb = new HTTPMessageBusClient(0, "", "", "");
    ```

    **Note:** twinId and proxyURL are set to `0` and `""` as the grid client will auto set them based on network environment selected and mnemonic entered.

    **RMB**

    ```ts
    import { MessageBusClient } from "ts-rmb-redis-client";

    const rmb = new MessageBusClient();
    ```

- project name: it's a name to isolate the deployments into a namespace.

    **Note:** only network can't be isolated, all project can see the same network.

- Backend storage: can select `fs`,`localstorage`, `auto`, or `tfkvstore`. (**default:** auto)

    **Note:** selecting `auto` will auto detect the process if it's node it will use `fs` and if it's browser it will use `localstorage`.

```ts
import { BackendStorageType } from "grid3_client";

const backendStorageType = BackendStorageType.auto
```

- keypair type: the keypair types supported are `sr25519` or `ed25519`. (**default:** `sr25519`)

```ts
import { KeypairType } from "grid3_client";

const keypairType = KeypairType.sr25519
```

### Create client instance

By gathering all the previous configuration in one script.

```ts
import { GridClient, NetworkEnv, BackendStorageType, KeypairType } from "grid3_client";
import { HTTPMessageBusClient } from "ts-rmb-http-client";
import { MessageBusClient } from "ts-rmb-redis-client";

// use http proxy client
const rmb = new HTTPMessageBusClient(0, "", "", "");

const gridClient = new GridClient(NetworkEnv.dev, mnemonic, "mysecret", rmb, "myproject", BackendStorageType.auto, KeypairType.sr25519);
await gridClient.connect();
```

**Important Note**: grid client should be disconnected after finishing its usage.

```ts
gridClient.disconnect();
```

## Usage examples

see [scripts](./scripts/README.md)

see [server](./docs/server.md)

## API Docs

<https://threefoldtech.github.io/grid3_client_ts/api/>
