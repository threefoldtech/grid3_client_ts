`cd ./solutions`

# Helpers commands

`./exec ./utility.ts list` to list all the vms with its contract id
`./exec ./utility.ts cancel <contract_id>` to cancel any contract id

### Funkwhale deployment

-   VM
    `./exec ./funkwhale/funkwhale_vm.ts deploy`
    `./exec ./funkwhale/funkwhale_vm.ts get`
    `./exec ./funkwhale/funkwhale_vm.ts destroy`

-   Gateway
    `./exec ./funkwhale/funkwhale_gw.ts deploy`
    `./exec ./funkwhale/funkwhale_gw.ts get`
    `./exec ./funkwhale/funkwhale_gw.ts destroy`
