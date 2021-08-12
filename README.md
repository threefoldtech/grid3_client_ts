# zos_typescript

## Prerequisites

- node
- npm

## Installation

```bash
npm install typescript -g
npm install
```

## How to run

*note*: Before running any of the scripts, the twinid, nodes selection, and the mnemonics of the user should be added in the scripts themsevles (the flow is still being adjusted)
- One virtual machine with ubuntu

    ```bash
    tsc test.ts && node test.js
    ```


- Two virtual machines with kubernetes master and worker nodes

    ```bash
    tsc test_kubernetes.ts && node test_kubernetes.js
    ```